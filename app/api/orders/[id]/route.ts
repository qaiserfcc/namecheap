import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

<<<<<<< HEAD
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
=======
// GET /api/orders/[id] - get order with items and events
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const orderId = parseInt(resolvedParams.id)
    
    // Fetch order
    const orderResult = await query(`SELECT * FROM orders WHERE id = $1`, [orderId])
    
    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Check authorization (admin or order owner)
    if (session.role !== 'admin' && order.user_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch order items with product details
    const items = await query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [orderId]
    )

    // Fetch order events
    const events = await query(
      `SELECT * FROM order_events WHERE order_id = $1 ORDER BY created_at ASC`,
      [orderId]
    )

    return NextResponse.json({
      ...order,
      items,
      events
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

<<<<<<< HEAD
    const { status } = await request.json()
    const orderId = Number.parseInt(params.id)

    const result = await query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, orderId],
    )

    return NextResponse.json(result[0])
=======
    const updates = await request.json()
    const resolvedParams = await params
    const orderId = Number.parseInt(resolvedParams.id)

    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    const allowedFields = ['status', 'tracking_number', 'shipping_provider', 'expected_delivery', 'notes']

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
    values.push(orderId)

    const result = await query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create order event if status changed
    if (updates.status) {
      await query(
        `INSERT INTO order_events (order_id, status, note) VALUES ($1, $2, $3)`,
        [orderId, updates.status, updates.eventNotes || `Status updated to ${updates.status}`]
      )
    }

    return NextResponse.json(result?.[0] || null)
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 })
  }
}
