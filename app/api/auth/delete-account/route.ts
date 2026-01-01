import { type NextRequest, NextResponse } from "next/server"
import { getSession, clearSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const userId = session.userId

    // Delete user's related data in order (respecting foreign key constraints)
    // Note: You may want to use CASCADE in your database schema instead
    
    // Delete addresses
    await query("DELETE FROM addresses WHERE user_id = $1", [userId])
    
    // Delete wishlist items
    await query("DELETE FROM wishlist WHERE user_id = $1", [userId])
    
    // Delete reviews
    await query("DELETE FROM reviews WHERE user_id = $1", [userId])
    
    // Delete order items first, then orders
    await query(
      "DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)",
      [userId]
    )
    await query("DELETE FROM orders WHERE user_id = $1", [userId])
    
    // Finally delete the user
    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [userId])

    if (!result || result.length === 0) {
      return ErrorResponses.notFound("User not found")
    }

    // Clear session
    await clearSession()

    return secureJsonResponse({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting account:", error)
    return ErrorResponses.serverError(error.message)
  }
}
