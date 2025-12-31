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

    const { items, shippingAddress, town, promotionCode } = await request.json()

    // Calculate total
    let totalAmount = 0
    for (const item of items) {
      const productResult = await query("SELECT price FROM products WHERE id = $1", [item.productId])
      if (productResult.length > 0) {
        totalAmount += productResult[0].price * item.quantity
      }
    }

    // Apply promotions
    let discountAmount = 0
    let promotionId: number | null = null
    let appliedCode: string | null = null

    // Check auto-apply promotions first
    const autoPromotions = await query(
      `SELECT * FROM promotions 
       WHERE auto_apply = true 
       AND active = true 
       AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP) 
       AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)
       AND (usage_limit IS NULL OR usage_count < usage_limit)
       AND (min_order_amount IS NULL OR min_order_amount <= $1)
       ORDER BY discount_value DESC
       LIMIT 1`,
      [totalAmount]
    )

    if (autoPromotions.length > 0) {
      const promo = autoPromotions[0]
      promotionId = promo.id
      appliedCode = promo.code

      if (promo.discount_type === 'percentage') {
        discountAmount = (totalAmount * promo.discount_value) / 100
        if (promo.max_discount && discountAmount > promo.max_discount) {
          discountAmount = promo.max_discount
        }
      } else {
        discountAmount = promo.discount_value
      }

      // Increment usage count
      await query(`UPDATE promotions SET usage_count = usage_count + 1 WHERE id = $1`, [promo.id])
    }

    // Check manual promo code if provided (overrides auto-apply if better)
    if (promotionCode) {
      const codePromotions = await query(
        `SELECT * FROM promotions 
         WHERE code = $1 
         AND active = true 
         AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP) 
         AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)
         AND (usage_limit IS NULL OR usage_count < usage_limit)
         AND (min_order_amount IS NULL OR min_order_amount <= $2)`,
        [promotionCode, totalAmount]
      )

      if (codePromotions.length > 0) {
        const promo = codePromotions[0]
        let codeDiscount = 0

        if (promo.discount_type === 'percentage') {
          codeDiscount = (totalAmount * promo.discount_value) / 100
          if (promo.max_discount && codeDiscount > promo.max_discount) {
            codeDiscount = promo.max_discount
          }
        } else {
          codeDiscount = promo.discount_value
        }

        // Use code discount if better
        if (codeDiscount > discountAmount) {
          // Revert auto-apply usage count if needed
          if (promotionId) {
            await query(`UPDATE promotions SET usage_count = usage_count - 1 WHERE id = $1`, [promotionId])
          }

          discountAmount = codeDiscount
          promotionId = promo.id
          appliedCode = promo.code

          // Increment usage count
          await query(`UPDATE promotions SET usage_count = usage_count + 1 WHERE id = $1`, [promo.id])
        }
      }
    }

    const finalAmount = totalAmount - discountAmount

    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, town, promotion_id, promotion_code, discount_amount, final_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [session.userId, totalAmount, shippingAddress, town, promotionId, appliedCode, discountAmount, finalAmount]
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

    // Create initial order event
    await query(
      `INSERT INTO order_events (order_id, status, notes) VALUES ($1, $2, $3)`,
      [orderId, 'pending', 'Order created']
    )

    return NextResponse.json(orderResult[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
