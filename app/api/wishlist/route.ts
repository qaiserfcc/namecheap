import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wishlist = await query(
      `SELECT 
        w.*,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.category as product_category,
        p.stock_quantity,
        p.average_rating,
        p.review_count,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as product_image,
        pv.sku as variant_sku,
        pv.price_override as variant_price,
        pv.stock_quantity as variant_stock
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_variants pv ON w.variant_id = pv.id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC`,
      [session.userId]
    )

    return NextResponse.json(wishlist)
  } catch (error: any) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, variant_id, notes, price_alert_enabled, price_threshold } = body

    if (!product_id) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 })
    }

    // Check if product exists
    const productCheck = await query("SELECT id, price FROM products WHERE id = $1", [product_id])
    if (productCheck.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if already in wishlist
    const existing = await query(
      "SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))",
      [session.userId, product_id, variant_id || null]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 }
      )
    }

    // Add to wishlist
    const result = await query(
      `INSERT INTO wishlists 
       (user_id, product_id, variant_id, notes, price_alert_enabled, price_threshold)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        session.userId,
        product_id,
        variant_id || null,
        notes || null,
        price_alert_enabled || false,
        price_threshold || null
      ]
    )

    return NextResponse.json(
      {
        message: "Added to wishlist",
        wishlist_item: result[0]
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const wishlistId = searchParams.get("id")
    const productId = searchParams.get("product_id")
    const variantId = searchParams.get("variant_id")

    if (wishlistId) {
      // Remove by wishlist ID
      await query(
        "DELETE FROM wishlists WHERE id = $1 AND user_id = $2",
        [wishlistId, session.userId]
      )
    } else if (productId) {
      // Remove by product ID (and optional variant)
      await query(
        `DELETE FROM wishlists 
         WHERE user_id = $1 AND product_id = $2 
         AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))`,
        [session.userId, productId, variantId || null]
      )
    } else {
      return NextResponse.json(
        { error: "Missing id or product_id parameter" },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: "Removed from wishlist" })
  } catch (error: any) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove from wishlist" },
      { status: 500 }
    )
  }
}
