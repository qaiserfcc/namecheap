import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Fetch all dashboard data in parallel
    const [
      companyInfo,
      supportInfo,
      bestSellers,
      featured,
      newArrivals,
      categories,
      promotions,
      sections
    ] = await Promise.all([
      query(`SELECT * FROM company_info ORDER BY key`),
      query(`SELECT * FROM support_info WHERE is_active = true ORDER BY display_order`),
      query(`SELECT * FROM vw_best_sellers LIMIT 8`),
      query(`SELECT * FROM vw_featured_products LIMIT 6`),
      query(`SELECT * FROM vw_new_arrivals LIMIT 8`),
      query(`SELECT * FROM vw_category_stats`),
      query(`
        SELECT * FROM promotions 
        WHERE active = true 
        AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
        AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)
        ORDER BY created_at DESC
      `),
      query(`SELECT * FROM dashboard_sections WHERE is_active = true ORDER BY display_order`)
    ])

    // Transform company info into key-value object
    const company = (companyInfo || []).reduce((acc: any, row: any) => {
      acc[row.key] = {
        value: row.value,
        metadata: row.metadata
      }
      return acc
    }, {})

    return NextResponse.json({
      company,
      support: supportInfo || [],
      bestSellers: bestSellers || [],
      featured: featured || [],
      newArrivals: newArrivals || [],
      categories: categories || [],
      promotions: promotions || [],
      sections: sections || []
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
