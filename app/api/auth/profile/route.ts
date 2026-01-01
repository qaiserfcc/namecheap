import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const result = await query(
      "SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = $1",
      [session.userId]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.notFound("User not found")
    }

    const user = result[0]
    
    return secureJsonResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone || "",
        role: user.role,
        createdAt: user.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error fetching user profile:", error)
    return ErrorResponses.serverError(error.message)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return ErrorResponses.unauthorized()
    }

    const body = await request.json()
    const { fullName, phone } = body

    if (!fullName || fullName.trim().length < 2) {
      return ErrorResponses.badRequest("Full name must be at least 2 characters")
    }

    const result = await query(
      "UPDATE users SET full_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, full_name, phone, role, created_at",
      [fullName.trim(), phone || null, session.userId]
    )

    if (!result || result.length === 0) {
      return ErrorResponses.notFound("User not found")
    }

    const user = result[0]

    return secureJsonResponse({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone || "",
        role: user.role,
        createdAt: user.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    return ErrorResponses.serverError(error.message)
  }
}
