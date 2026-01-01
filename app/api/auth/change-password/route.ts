import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return ErrorResponses.badRequest("All password fields are required")
    }

    if (newPassword !== confirmPassword) {
      return ErrorResponses.badRequest("New passwords do not match")
    }

    if (newPassword.length < 8) {
      return ErrorResponses.badRequest("New password must be at least 8 characters")
    }

    // Get user from database
    const userResult = await query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [session.userId]
    )

    if (!userResult || userResult.length === 0) {
      return ErrorResponses.notFound("User not found")
    }

    const user = userResult[0]

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password_hash)

    if (!isCurrentPasswordValid) {
      return ErrorResponses.badRequest("Current password is incorrect")
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await query(
      "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newPasswordHash, session.userId]
    )

    return secureJsonResponse({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error: any) {
    console.error("Error changing password:", error)
    return ErrorResponses.serverError(error.message)
  }
}
