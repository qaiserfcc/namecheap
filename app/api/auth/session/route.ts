import { type NextRequest } from "next/server"
import { getSession } from "@/lib/sessions"
import { ErrorResponses, secureJsonResponse } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return secureJsonResponse({
        success: true,
        user: null,
      })
    }

    return secureJsonResponse({
      success: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
    })
  } catch (error: any) {
    console.error("Error fetching session:", error)
    return ErrorResponses.serverError(error.message)
  }
}
