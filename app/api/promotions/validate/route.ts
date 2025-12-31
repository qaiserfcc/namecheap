import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")

    if (!code) {
      return Response.json(
        { error: "Promo code is required" },
        { status: 400 }
      )
    }

    const result = await query(
      `SELECT id, code, discount_type, discount_value, max_discount, usage_limit, usage_count, min_order_amount, active, starts_at, ends_at
       FROM promotions
       WHERE code = $1 AND active = true`,
      [code.toUpperCase()]
    )

    if (result.length === 0) {
      return Response.json(
        { error: "Invalid promo code" },
        { status: 404 }
      )
    }

    const promo = result[0]

    // Check if promotion is still valid
    const now = new Date()
    const startsAt = new Date(promo.starts_at)
    const endsAt = new Date(promo.ends_at)

    if (now < startsAt || now > endsAt) {
      return Response.json(
        { error: "Promo code has expired" },
        { status: 400 }
      )
    }

    // Check usage limit
    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
      return Response.json(
        { error: "Promo code usage limit reached" },
        { status: 400 }
      )
    }

    return Response.json({
      id: promo.id,
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      max_discount: promo.max_discount,
      min_order_amount: promo.min_order_amount,
    })
  } catch (error) {
    console.error("Promo validation error:", error)
    return Response.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    )
  }
}
