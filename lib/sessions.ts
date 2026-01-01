import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

// Validate session secret configuration
function getSessionSecret(): Uint8Array {
  const secretString = process.env.SESSION_SECRET

  // In production, SESSION_SECRET must be set
  if (process.env.NODE_ENV === "production" && !secretString) {
    throw new Error("SESSION_SECRET environment variable must be set in production")
  }

  // Prevent use of default value in production
  if (process.env.NODE_ENV === "production" && secretString === "your-secret-key-change-in-production") {
    throw new Error("SESSION_SECRET cannot use default value in production")
  }

  // Warn in development if using default
  if (process.env.NODE_ENV !== "production" && (!secretString || secretString === "your-secret-key-change-in-production")) {
    console.warn("⚠️  WARNING: Using default SESSION_SECRET. Set a secure value in .env file")
  }

  const secret = secretString || "your-secret-key-change-in-production"
  
  // Warn if secret is too short
  if (secret.length < 32) {
    console.warn("⚠️  WARNING: SESSION_SECRET should be at least 32 characters long for security")
  }

  return new TextEncoder().encode(secret)
}

const secret = getSessionSecret()

export interface SessionData {
  userId: number
  email: string
  role: string
}

export async function createSession(data: SessionData): Promise<string> {
  return new SignJWT(data).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as SessionData
  } catch (err) {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getSessionCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("session")?.value
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
