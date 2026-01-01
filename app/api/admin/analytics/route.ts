import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"
import { ErrorResponses, secureJsonResponse, requireAdmin } from "@/lib/security"
import { applyRateLimit, RATE_LIMITS } from "@/lib/rateLimit"

// GET /api/admin/analytics - comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const limitResult = await applyRateLimit(request, RATE_LIMITS.API)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Verify admin access
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return ErrorResponses.unauthorized()
    }

    // Use materialized view for fast summary metrics
    const summaryResult = await query(`
      SELECT 
        revenue_today, revenue_week, revenue_month, revenue_total,
        orders_today, orders_week, orders_month, orders_total,
        avg_order_value, total_users, new_users_month,
        total_products, low_stock_products, active_promotions,
        refreshed_at
      FROM mv_analytics_summary 
      LIMIT 1
    `)
    const summary = summaryResult[0] || {}

    // Get additional data in parallel (limited queries)
    const [
      topProducts,
      revenueByDay,
      ordersByStatus,
      repeatBuyers,
      promotionUsage,
    ] = await Promise.all([
      // Top 10 products by revenue
      query(`
        SELECT p.id, p.name, p.image_url, 
               SUM(oi.quantity) as total_sold, 
               SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id, p.name, p.image_url
        ORDER BY revenue DESC
        LIMIT 10
      `),
      
      // Revenue by day (last 30 days)
      query(`
        SELECT DATE(created_at) as date, 
               COALESCE(SUM(final_amount), 0) as revenue
        FROM orders
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `),
      
      // Orders by status
      query(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`),
      
      // Repeat buyers count
      query(`
        SELECT COUNT(*) as count 
        FROM (
          SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 1
        ) sub
      `),
      
      // Top 10 promotions by usage
      query(`
        SELECT p.name, p.code, p.discount_type, p.discount_value, 
               COUNT(o.id) as times_used, 
               COALESCE(SUM(o.discount_amount), 0) as total_discount
        FROM promotions p
        LEFT JOIN orders o ON p.id = o.promotion_id
        WHERE p.active = true
        GROUP BY p.id, p.name, p.code, p.discount_type, p.discount_value
        ORDER BY times_used DESC
        LIMIT 10
      `),
    ])

    // Build response using materialized view data + additional queries
    const response = secureJsonResponse({
      // Keep legacy top-level key for compatibility
      totalRevenue: parseFloat(summary.revenue_total || 0),
      
      revenue: {
        today: parseFloat(summary.revenue_today || 0),
        thisWeek: parseFloat(summary.revenue_week || 0),
        thisMonth: parseFloat(summary.revenue_month || 0),
        total: parseFloat(summary.revenue_total || 0),
        byDay: revenueByDay.map((row: any) => ({
          date: row.date,
          revenue: parseFloat(row.revenue)
        }))
      },
      
      orders: {
        today: parseInt(summary.orders_today || 0),
        thisWeek: parseInt(summary.orders_week || 0),
        thisMonth: parseInt(summary.orders_month || 0),
        total: parseInt(summary.orders_total || 0),
        avgValue: parseFloat(summary.avg_order_value || 0),
        byStatus: ordersByStatus.map((row: any) => ({
          status: row.status,
          count: parseInt(row.count)
        }))
      },
      
      products: {
        total: parseInt(summary.total_products || 0),
        lowStock: parseInt(summary.low_stock_products || 0),
        topByRevenue: topProducts.map((row: any) => ({
          id: row.id,
          name: row.name,
          imageUrl: row.image_url,
          totalSold: parseInt(row.total_sold),
          revenue: parseFloat(row.revenue)
        }))
      },
      
      users: {
        total: parseInt(summary.total_users || 0),
        newThisMonth: parseInt(summary.new_users_month || 0),
        repeatBuyers: repeatBuyers[0]?.count ? parseInt(repeatBuyers[0].count) : 0
      },
      
      promotions: {
        active: parseInt(summary.active_promotions || 0),
        performance: promotionUsage.map((row: any) => ({
          name: row.name,
          code: row.code,
          discountType: row.discount_type,
          discountValue: parseFloat(row.discount_value),
          timesUsed: parseInt(row.times_used),
          totalDiscount: parseFloat(row.total_discount)
        }))
      },
      
      metadata: {
        refreshedAt: summary.refreshed_at,
        note: "Analytics data refreshed periodically. Run REFRESH MATERIALIZED VIEW to update."
      }
    })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
    
  } catch (error: any) {
    console.error("Analytics error:", error)
    return ErrorResponses.serverError("Failed to fetch analytics")
  }
}
