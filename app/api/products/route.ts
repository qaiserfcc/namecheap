import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"
import { createProductSchema } from "@/lib/validation"
import { applyRateLimit, RATE_LIMITS } from "@/lib/rateLimit"
import { ErrorResponses, secureJsonResponse, validatePagination } from "@/lib/security"
import { logAuditEvent } from "@/lib/audit"

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const limitResult = await applyRateLimit(request, RATE_LIMITS.READ)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const { limit, offset } = validatePagination(searchParams)
    const category = searchParams.get("category")

    // Build query with optional filters
    let queryText = "SELECT * FROM products"
    const params: any[] = []
    
    if (category) {
      queryText += " WHERE category = $1"
      params.push(category)
    }
    
    queryText += " ORDER BY created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2)
    params.push(limit, offset)

    const result = await query(queryText, params)
    
    // Get total count
    const countQuery = category 
      ? "SELECT COUNT(*) as total FROM products WHERE category = $1"
      : "SELECT COUNT(*) as total FROM products"
    const countParams = category ? [category] : []
    const countResult = await query(countQuery, countParams)
    const total = parseInt(countResult[0]?.total || 0)

    const response = secureJsonResponse({
      products: Array.isArray(result) ? result : [],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return secureJsonResponse({ products: [], pagination: { total: 0, limit: 20, offset: 0, hasMore: false } })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const limitResult = await applyRateLimit(request, RATE_LIMITS.MUTATION)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Verify admin access
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return ErrorResponses.unauthorized()
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createProductSchema.safeParse(body)

    if (!validation.success) {
      return ErrorResponses.validationError(validation.error.format())
    }

    const { name, description, price, category, imageUrl, stock } = validation.data

    // Create product
    const result = await query(
      "INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, category, imageUrl, stock],
    )

    const product = result?.[0]

    // Log audit event
    await logAuditEvent({
      userId: session.userId,
      userEmail: session.email,
      action: "CREATE",
      entity: "PRODUCT",
      entityId: product.id,
      changes: { created: product },
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    const response = secureJsonResponse(product, { status: 201 })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Failed to create product:", error)
    return ErrorResponses.serverError("Failed to create product")
  }
}
