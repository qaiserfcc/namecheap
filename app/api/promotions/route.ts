import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/promotions - list active promotions (public) or all (admin)
export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)
    
    let result
    if (session?.role === "admin") {
      // Admin sees all
      result = await query(`
        SELECT * FROM promotions 
        ORDER BY created_at DESC
      `)
    } else {
      // Public sees active, auto-apply or code-based, within date range
      result = await query(`
        SELECT * FROM promotions 
        WHERE active = true 
          AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
          AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)
        ORDER BY created_at DESC
      `)
    }
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch promotions" }, { status: 500 })
  }
}

// POST /api/promotions - create new promotion (admin only)
export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      name,
      description,
      code,
      auto_apply,
      discount_type,
      discount_value,
      min_order_amount,
      product_ids,
      category,
      starts_at,
      ends_at,
      active,
      usage_limit,
      max_discount,
      stackable,
    } = await request.json()

    const result = await query(
      `INSERT INTO promotions (
        name, description, code, auto_apply, discount_type, discount_value,
        min_order_amount, product_ids, category, starts_at, ends_at,
        active, usage_limit, max_discount, stackable
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        name,
        description || null,
        code || null,
        auto_apply || false,
        discount_type || 'percent',
        discount_value || 0,
        min_order_amount || 0,
        product_ids || [],
        category || null,
        starts_at || null,
        ends_at || null,
        active !== false,
        usage_limit || null,
        max_discount || null,
        stackable || false,
      ]
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create promotion" }, { status: 500 })
  }
}
