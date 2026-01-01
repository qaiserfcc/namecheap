import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

// GET all addresses for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const addresses = await query(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC",
      [session.userId]
    )

    return secureJsonResponse({
      success: true,
      addresses: addresses || [],
    })
  } catch (error: any) {
    console.error("Error fetching addresses:", error)
    return ErrorResponses.serverError(error.message)
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const body = await request.json()
    const { street, city, state, postalCode, country, phone, isDefault } = body

    // Validate required fields
    if (!street || !city || !state || !postalCode || !country) {
      return ErrorResponses.badRequest("All address fields are required")
    }

    // If this is set as default, unset all other defaults for this user
    if (isDefault) {
      await query(
        "UPDATE addresses SET is_default = false WHERE user_id = $1",
        [session.userId]
      )
    }

    // Create the address
    const result = await query(
      `INSERT INTO addresses (user_id, street_address, city, state, postal_code, country, phone, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [session.userId, street, city, state, postalCode, country, phone || null, isDefault || false]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.serverError("Failed to create address")
    }

    return secureJsonResponse({
      success: true,
      message: "Address created successfully",
      address: result[0],
    }, 201)
  } catch (error: any) {
    console.error("Error creating address:", error)
    return ErrorResponses.serverError(error.message)
  }
}
