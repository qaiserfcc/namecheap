import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/promotions/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const promoId = parseInt(params.id)
    const result = await query(`SELECT * FROM promotions WHERE id = $1`, [promoId])
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch promotion" }, { status: 500 })
  }
}

// PATCH /api/promotions/[id] - update promotion (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const promoId = parseInt(params.id)
    const updates = await request.json()

    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    const allowedFields = [
      'name', 'description', 'code', 'auto_apply', 'discount_type', 'discount_value',
      'min_order_amount', 'product_ids', 'category', 'starts_at', 'ends_at',
      'active', 'usage_limit', 'max_discount', 'stackable', 'usage_count'
    ]

    for (const key of allowedFields) {
      if (key in updates) {
        fields.push(`${key} = $${idx}`)
        values.push(updates[key])
        idx++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(promoId)

    const result = await query(
      `UPDATE promotions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update promotion" }, { status: 500 })
  }
}

// DELETE /api/promotions/[id] - delete promotion (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const promoId = parseInt(params.id)
    const result = await query(`DELETE FROM promotions WHERE id = $1 RETURNING id`, [promoId])

    if (result.length === 0) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete promotion" }, { status: 500 })
  }
}
