import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "your-secret-key-change-in-production")

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
