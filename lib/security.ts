/**
 * Security Utilities
 * Additional security helpers and middleware
 */

import { NextResponse } from "next/server"

/**
 * Environment validation
 * Ensures critical environment variables are set
 */
export function validateEnvironment() {
  const required = ["DATABASE_URL", "SESSION_SECRET"]
  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  // Warn about default values in development
  if (process.env.NODE_ENV !== "production") {
    if (process.env.SESSION_SECRET === "your-secret-key-change-in-production") {
      console.warn("⚠️  WARNING: Using default SESSION_SECRET. Set a secure value in .env")
    }
  }
}

/**
 * Validate session secret is properly configured
 */
export function validateSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production")
  }

  if (secret === "your-secret-key-change-in-production") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET cannot use default value in production")
    }
    console.warn("⚠️  WARNING: Using default SESSION_SECRET. Set a secure value in .env")
  }

  if (secret && secret.length < 32) {
    console.warn("⚠️  WARNING: SESSION_SECRET should be at least 32 characters long")
  }
}

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Enable XSS protection
  "X-XSS-Protection": "1; mode=block",
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Referrer policy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Remove server header
  "X-Powered-By": "namecheap-api",
} as const

/**
 * Add security headers to a response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Create a secure API response with proper headers
 */
export function secureJsonResponse(data: any, options?: { status?: number; headers?: Record<string, string> }) {
  const response = NextResponse.json(data, {
    status: options?.status || 200,
    headers: options?.headers,
  })
  return addSecurityHeaders(response)
}

/**
 * Standardized error response format
 */
export interface ApiError {
  error: {
    code: string
    message: string
    details?: any
  }
}

/**
 * Error response builder
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status = 400
): NextResponse<ApiError> {
  return secureJsonResponse(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  unauthorized: () => errorResponse("UNAUTHORIZED", "Unauthorized access", undefined, 401),
  forbidden: () => errorResponse("FORBIDDEN", "Forbidden", undefined, 403),
  notFound: (resource = "Resource") => errorResponse("NOT_FOUND", `${resource} not found`, undefined, 404),
  validationError: (details: any) => errorResponse("VALIDATION_ERROR", "Validation failed", details, 400),
  serverError: (message = "Internal server error") => errorResponse("SERVER_ERROR", message, undefined, 500),
  rateLimitExceeded: (retryAfter: number) =>
    NextResponse.json(
      {
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
          retryAfter,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        },
      }
    ),
}

/**
 * Sanitize error for client response
 * Hides sensitive information in production
 */
export function sanitizeError(error: any): { message: string; details?: any } {
  if (process.env.NODE_ENV === "production") {
    // Don't expose internal error details in production
    return {
      message: "An error occurred while processing your request",
    }
  }

  // In development, show more details
  return {
    message: error.message || "An error occurred",
    details: error.stack,
  }
}

/**
 * Validate and sanitize pagination parameters
 */
export function validatePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Check if user is admin
 */
export function requireAdmin(session: { role: string } | null) {
  if (!session || session.role !== "admin") {
    throw new Error("Admin access required")
  }
}

/**
 * Check if user is authenticated
 */
export function requireAuth(session: any) {
  if (!session) {
    throw new Error("Authentication required")
  }
}

/**
 * Verify resource ownership or admin access
 */
export function requireOwnershipOrAdmin(session: { userId: number; role: string } | null, resourceUserId: number) {
  if (!session) {
    throw new Error("Authentication required")
  }

  if (session.role !== "admin" && session.userId !== resourceUserId) {
    throw new Error("Forbidden: You don't have access to this resource")
  }
}

/**
 * Generate a random secure token
 */
export function generateSecureToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256)
    }
  }

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }

  return result
}

/**
 * Hash a string using Web Crypto API (for non-password hashing)
 */
export async function hashString(str: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Fallback: simple hash (not cryptographically secure)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(16)
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File, options: { maxSize?: number; allowedTypes?: string[] }) {
  const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB default
  const allowedTypes = options.allowedTypes || ["text/csv", "application/json"]

  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`)
  }

  return true
}

/**
 * Redact sensitive data from logs
 */
export function redactSensitiveData(data: any): any {
  const sensitiveFields = ["password", "password_hash", "token", "secret", "apiKey", "creditCard"]

  if (typeof data !== "object" || data === null) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData)
  }

  const redacted = { ...data }
  for (const key in redacted) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      redacted[key] = "[REDACTED]"
    } else if (typeof redacted[key] === "object") {
      redacted[key] = redactSensitiveData(redacted[key])
    }
  }

  return redacted
}
