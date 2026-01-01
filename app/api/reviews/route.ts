import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/reviews - Get all reviews or filter by product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const status = searchParams.get("status") || "approved"
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let reviews
    if (productId) {
      // Get reviews for specific product
      reviews = await query(
        `SELECT 
          pr.*,
          u.full_name as user_name,
          u.email as user_email
        FROM product_reviews pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = $1 AND pr.status = $2
        ORDER BY pr.created_at DESC
        LIMIT $3 OFFSET $4`,
        [productId, status, limit, offset]
      )
    } else {
      // Get all reviews (admin only)
      const sessionToken = await getSessionCookie()
      const session = await verifySession(sessionToken!)

      if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      reviews = await query(
        `SELECT 
          pr.*,
          u.full_name as user_name,
          u.email as user_email,
          p.name as product_name
        FROM product_reviews pr
        LEFT JOIN users u ON pr.user_id = u.id
        LEFT JOIN products p ON pr.product_id = p.id
        ORDER BY pr.created_at DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      )
    }

    return NextResponse.json(reviews)
  } catch (error: any) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, rating, title, review_text, guest_name, guest_email } = body

    // Validation
    if (!product_id || !rating || !review_text) {
      return NextResponse.json(
        { error: "Missing required fields: product_id, rating, review_text" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Check if user is logged in
    const sessionToken = await getSessionCookie()
    let session = null
    let userId = null

    try {
      session = await verifySession(sessionToken!)
      userId = session?.userId
    } catch {
      // Not logged in - allow guest review if email/name provided
    }

    // If not logged in, require guest info
    if (!userId && (!guest_name || !guest_email)) {
      return NextResponse.json(
        { error: "Guest reviews require name and email" },
        { status: 400 }
      )
    }

    // Validate email format for guest reviews
    if (!userId && guest_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(guest_email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }
    }

    // Check if product exists
    const productCheck = await query("SELECT id FROM products WHERE id = $1", [product_id])
    if (productCheck.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user already reviewed this product
    if (userId) {
      const existingReview = await query(
        "SELECT id FROM product_reviews WHERE product_id = $1 AND user_id = $2",
        [product_id, userId]
      )

      if (existingReview.length > 0) {
        return NextResponse.json(
          { error: "You have already reviewed this product" },
          { status: 400 }
        )
      }
    }

    // Check if this is a verified purchase
    let isVerifiedPurchase = false
    if (userId) {
      const purchaseCheck = await query(
        `SELECT 1 FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = $1 AND oi.product_id = $2
         LIMIT 1`,
        [userId, product_id]
      )
      isVerifiedPurchase = purchaseCheck.length > 0
    }

    // Create review
    const result = await query(
      `INSERT INTO product_reviews 
       (product_id, user_id, guest_name, guest_email, rating, title, review_text, is_verified_purchase, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        product_id,
        userId,
        guest_name || null,
        guest_email || null,
        rating,
        title || null,
        review_text,
        isVerifiedPurchase,
        'pending' // Reviews start as pending for moderation
      ]
    )

    return NextResponse.json(
      {
        message: "Review submitted successfully. It will appear after moderation.",
        review: result[0]
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    )
  }
}
