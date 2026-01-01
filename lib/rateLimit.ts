/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting request frequency
 */

import { NextResponse } from "next/server"

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {}

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
  /** Custom identifier function (defaults to IP address) */
  identifier?: (request: Request) => string
  /** Custom error message */
  message?: string
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  /** Strict limit for authentication endpoints */
  AUTH: {
    maxRequests: 5,
    windowSeconds: 60, // 5 requests per minute
    message: "Too many authentication attempts. Please try again later.",
  },
  /** Standard limit for API endpoints */
  API: {
    maxRequests: 100,
    windowSeconds: 60, // 100 requests per minute
    message: "Too many requests. Please slow down.",
  },
  /** Strict limit for mutation operations */
  MUTATION: {
    maxRequests: 30,
    windowSeconds: 60, // 30 mutations per minute
    message: "Too many operations. Please slow down.",
  },
  /** Lenient limit for read operations */
  READ: {
    maxRequests: 300,
    windowSeconds: 60, // 300 reads per minute
    message: "Too many requests. Please slow down.",
  },
  /** Very strict limit for bulk operations */
  BULK: {
    maxRequests: 5,
    windowSeconds: 300, // 5 bulk operations per 5 minutes
    message: "Too many bulk operations. Please wait before trying again.",
  },
} as const

/**
 * Extract identifier from request (IP address)
 */
function getDefaultIdentifier(request: Request): string {
  const headers = request.headers
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  )
}

/**
 * Clean up expired entries from the store
 */
function cleanupStore() {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupStore, 5 * 60 * 1000)
}

/**
 * Check if request exceeds rate limit
 * @returns true if rate limit exceeded, false otherwise
 */
export function checkRateLimit(request: Request, options: RateLimitOptions): boolean {
  const identifier = options.identifier ? options.identifier(request) : getDefaultIdentifier(request)
  const key = `${identifier}:${request.url}`
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  // Get or create entry
  let entry = store[key]

  if (!entry || entry.resetTime < now) {
    // Create new entry
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    store[key] = entry
    return false // Not rate limited
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  return entry.count > options.maxRequests
}

/**
 * Get rate limit info for headers
 */
export function getRateLimitInfo(request: Request, options: RateLimitOptions) {
  const identifier = options.identifier ? options.identifier(request) : getDefaultIdentifier(request)
  const key = `${identifier}:${request.url}`
  const entry = store[key]
  const now = Date.now()

  if (!entry || entry.resetTime < now) {
    return {
      limit: options.maxRequests,
      remaining: options.maxRequests,
      reset: Math.floor((now + options.windowSeconds * 1000) / 1000),
    }
  }

  return {
    limit: options.maxRequests,
    remaining: Math.max(0, options.maxRequests - entry.count),
    reset: Math.floor(entry.resetTime / 1000),
  }
}

/**
 * Rate limiting middleware
 * Returns a NextResponse with 429 status if rate limit exceeded
 */
export function rateLimit(options: RateLimitOptions) {
  return (request: Request) => {
    const isLimited = checkRateLimit(request, options)
    const info = getRateLimitInfo(request, options)

    if (isLimited) {
      const retryAfter = Math.ceil((info.reset * 1000 - Date.now()) / 1000)

      return NextResponse.json(
        {
          error: options.message || "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": info.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": info.reset.toString(),
            "Retry-After": retryAfter.toString(),
          },
        }
      )
    }

    return {
      headers: {
        "X-RateLimit-Limit": info.limit.toString(),
        "X-RateLimit-Remaining": info.remaining.toString(),
        "X-RateLimit-Reset": info.reset.toString(),
      },
    }
  }
}

/**
 * Apply rate limit to a request
 * Usage: const limitResult = await applyRateLimit(request, RATE_LIMITS.AUTH)
 *        if (limitResult.limited) return limitResult.response
 */
export async function applyRateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<{ limited: boolean; response?: NextResponse; headers: Record<string, string> }> {
  const result = rateLimit(options)(request)

  if (result instanceof NextResponse) {
    return {
      limited: true,
      response: result,
      headers: {},
    }
  }

  return {
    limited: false,
    headers: result.headers,
  }
}

/**
 * Create a rate-limited API handler wrapper
 */
export function withRateLimit(options: RateLimitOptions, handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    const limitResult = await applyRateLimit(request, options)

    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    const response = await handler(request)

    // Add rate limit headers to successful responses
    if (limitResult.headers) {
      Object.entries(limitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }

    return response
  }
}
