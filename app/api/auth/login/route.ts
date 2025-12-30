import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/sessions"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = await createSession(sessionData)
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
