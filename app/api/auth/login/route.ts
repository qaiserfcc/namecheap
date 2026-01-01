import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/sessions"
import { loginSchema } from "@/lib/validation"
import { applyRateLimit, RATE_LIMITS } from "@/lib/rateLimit"
import { ErrorResponses, secureJsonResponse, sanitizeError } from "@/lib/security"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    // Apply strict rate limiting for login attempts
    const limitResult = await applyRateLimit(request, RATE_LIMITS.AUTH)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Parse request body once
    requestBody = await request.json()
    
    // Validate request body
    const validation = loginSchema.safeParse(requestBody)

    if (!validation.success) {
      return ErrorResponses.validationError(validation.error.format())
    }

    const { email, password } = validation.data

    // Authenticate user
    const user = await authenticateUser(email, password)

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = await createSession(sessionData)
    await setSessionCookie(token)

    // Log successful login
    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "LOGIN",
      entity: "AUTH",
      metadata: { success: true },
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Return success response
    const response = secureJsonResponse({
      success: true,
      user,
    })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Login error:", sanitizeError(error))
    
    // Log failed login attempt (without user ID since auth failed)
    if (requestBody.email) {
      await logAuditEvent({
        userId: 0, // Use 0 for failed attempts
        userEmail: requestBody.email || "unknown",
        action: "LOGIN",
        entity: "AUTH",
        metadata: { success: false, error: error.message },
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      }).catch(() => {}) // Ignore audit logging errors
    }
    
    // Generic error message to prevent user enumeration
    return ErrorResponses.unauthorized()
  }
}
