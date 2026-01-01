import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const addressId = parseInt(params.id)
    if (isNaN(addressId)) {
      return ErrorResponses.badRequest("Invalid address ID")
    }

    // Verify address belongs to user
    const existingAddress = await query(
      "SELECT * FROM addresses WHERE id = $1 AND user_id = $2",
      [addressId, session.userId]
    )

    if (!existingAddress || existingAddress.length === 0) {
      return ErrorResponses.notFound("Address not found")
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
        "UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2",
        [session.userId, addressId]
      )
    }

    // Update the address
    const result = await query(
      `UPDATE addresses 
       SET street_address = $1, city = $2, state = $3, postal_code = $4, 
           country = $5, phone = $6, is_default = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [street, city, state, postalCode, country, phone || null, isDefault || false, addressId, session.userId]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.serverError("Failed to update address")
    }

    return secureJsonResponse({
      success: true,
      message: "Address updated successfully",
      address: result[0],
    })
  } catch (error: any) {
    console.error("Error updating address:", error)
    return ErrorResponses.serverError(error.message)
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const addressId = parseInt(params.id)
    if (isNaN(addressId)) {
      return ErrorResponses.badRequest("Invalid address ID")
    }

    // Delete the address (only if it belongs to the user)
    const result = await query(
      "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id",
      [addressId, session.userId]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.notFound("Address not found")
    }

    return secureJsonResponse({
      success: true,
      message: "Address deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting address:", error)
    return ErrorResponses.serverError(error.message)
  }
}
