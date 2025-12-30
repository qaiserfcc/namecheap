import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/sessions"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await registerUser(email, password, fullName, role || "buyer")

    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = await createSession(sessionData)
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
