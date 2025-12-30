import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let result
    if (session.role === "admin") {
      // Admin sees all orders
      result = await query(
        `SELECT o.*, u.full_name, u.email, u.phone, u.id as user_id 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC`,
      )
    } else {
      // Buyer sees only their orders
      result = await query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [session.userId])
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, shippingAddress, town } = await request.json()

    // Calculate total
    const totalResult = await query("SELECT SUM(price * $2::int) as total FROM order_items WHERE id = ANY($1::int[])", [
      items.map((item: any) => item.id),
      1,
    ])

    let total = 0
    for (const item of items) {
      const productResult = await query("SELECT price FROM products WHERE id = $1", [item.productId])
      if (productResult.length > 0) {
        total += productResult[0].price * item.quantity
      }
    }

    const orderResult = await query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, town) VALUES ($1, $2, $3, $4) RETURNING *",
      [session.userId, total, shippingAddress, town],
    )

    const orderId = orderResult[0].id

    // Insert order items
    for (const item of items) {
      const productResult = await query("SELECT price FROM products WHERE id = $1", [item.productId])
      if (productResult.length > 0) {
        await query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)", [
          orderId,
          item.productId,
          item.quantity,
          productResult[0].price,
        ])
      }
    }

    return NextResponse.json(orderResult[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
