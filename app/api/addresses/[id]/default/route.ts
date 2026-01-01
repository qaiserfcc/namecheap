import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

// PUT - Set address as default
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

    // Unset all other defaults for this user
    await query(
      "UPDATE addresses SET is_default = false WHERE user_id = $1",
      [session.userId]
    )

    // Set this address as default
    const result = await query(
      "UPDATE addresses SET is_default = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *",
      [addressId, session.userId]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.serverError("Failed to set default address")
    }

    return secureJsonResponse({
      success: true,
      message: "Default address updated successfully",
      address: result[0],
    })
  } catch (error: any) {
    console.error("Error setting default address:", error)
    return ErrorResponses.serverError(error.message)
  }
}
