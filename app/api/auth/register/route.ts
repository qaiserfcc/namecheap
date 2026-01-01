import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/sessions"
import { registerSchema } from "@/lib/validation"
import { applyRateLimit, RATE_LIMITS } from "@/lib/rateLimit"
import { ErrorResponses, secureJsonResponse, sanitizeError } from "@/lib/security"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const limitResult = await applyRateLimit(request, RATE_LIMITS.AUTH)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return ErrorResponses.validationError(validation.error.format())
    }

    const { email, password, fullName, role } = validation.data

    // Register user
    const user = await registerUser(email, password, fullName, role)

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = await createSession(sessionData)
    await setSessionCookie(token)

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "CREATE",
      entity: "USER",
      entityId: user.id,
      metadata: { role: user.role },
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Return success response
    const response = secureJsonResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Registration error:", sanitizeError(error))
    
    if (error.message === "User already exists") {
      return ErrorResponses.validationError({ email: "Email already registered" })
    }
    
    return ErrorResponses.serverError("Registration failed")
  }
}
