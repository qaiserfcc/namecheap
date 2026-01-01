import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/admin/analytics - comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      revenueTotal,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      ordersTotal,
      avgOrderValue,
      topProducts,
      revenueByDay,
      ordersByStatus,
      totalUsers,
      newUsersThisMonth,
      repeatBuyers,
      totalProducts,
      lowStockProducts,
      activePromotions,
      promotionUsage,
    ] = await Promise.all([
      query(`SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE DATE(created_at) = CURRENT_DATE`),
      query(`SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`),
      query(`SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`),
      query(`SELECT COALESCE(SUM(final_amount), 0) as total FROM orders`),
      query(`SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURRENT_DATE`),
      query(`SELECT COUNT(*) as count FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`),
      query(`SELECT COUNT(*) as count FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`),
      query(`SELECT COUNT(*) as count FROM orders`),
      query(`SELECT COALESCE(AVG(final_amount), 0) as avg FROM orders`),
      query(`SELECT p.id, p.name, p.image_url, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as revenue
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             GROUP BY p.id, p.name, p.image_url
             ORDER BY revenue DESC
             LIMIT 10`),
      query(`SELECT DATE(created_at) as date, COALESCE(SUM(final_amount), 0) as revenue
             FROM orders
             WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
             GROUP BY DATE(created_at)
             ORDER BY date ASC`),
      query(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`),
      query(`SELECT COUNT(*) as count FROM users WHERE role = 'buyer'`),
      query(`SELECT COUNT(*) as count FROM users WHERE role = 'buyer' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`),
      query(`SELECT COUNT(*) as count FROM (
               SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 1
             ) sub`),
      query(`SELECT COUNT(*) as count FROM products`),
      query(`SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10`),
      query(`SELECT COUNT(*) as count FROM promotions WHERE active = true AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)`),
      query(`SELECT p.name, p.code, p.discount_type, p.discount_value, COUNT(o.id) as times_used, COALESCE(SUM(o.discount_amount), 0) as total_discount
             FROM promotions p
             LEFT JOIN orders o ON p.id = o.promotion_id
             WHERE p.active = true
             GROUP BY p.id, p.name, p.code, p.discount_type, p.discount_value
             ORDER BY times_used DESC
             LIMIT 10`),
    ])

    const totalRevenue = parseFloat(revenueTotal[0].total)

    return NextResponse.json({
      // Keep legacy top-level key for compatibility with tests/clients expecting totalRevenue
      totalRevenue,
      revenue: {
        today: parseFloat(revenueToday[0].total),
        thisWeek: parseFloat(revenueThisWeek[0].total),
        thisMonth: parseFloat(revenueThisMonth[0].total),
        total: totalRevenue,
        byDay: revenueByDay.map((row: any) => ({
          date: row.date,
          revenue: parseFloat(row.revenue)
        }))
      },
      orders: {
        today: parseInt(ordersToday[0].count),
        thisWeek: parseInt(ordersThisWeek[0].count),
        thisMonth: parseInt(ordersThisMonth[0].count),
        total: parseInt(ordersTotal[0].count),
        avgValue: parseFloat(avgOrderValue[0].avg),
        byStatus: ordersByStatus.map((row: any) => ({
          status: row.status,
          count: parseInt(row.count)
        }))
      },
      products: {
        total: parseInt(totalProducts[0].count),
        lowStock: parseInt(lowStockProducts[0].count),
        topByRevenue: topProducts.map((row: any) => ({
          id: row.id,
          name: row.name,
          imageUrl: row.image_url,
          totalSold: parseInt(row.total_sold),
          revenue: parseFloat(row.revenue)
        }))
      },
      users: {
        total: parseInt(totalUsers[0].count),
        newThisMonth: parseInt(newUsersThisMonth[0].count),
        repeatBuyers: repeatBuyers[0]?.count ? parseInt(repeatBuyers[0].count) : 0
      },
      promotions: {
        active: parseInt(activePromotions[0].count),
        performance: promotionUsage.map((row: any) => ({
          name: row.name,
          code: row.code,
          discountType: row.discount_type,
          discountValue: parseFloat(row.discount_value),
          timesUsed: parseInt(row.times_used),
          totalDiscount: parseFloat(row.total_discount)
        }))
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 })
  }
}
