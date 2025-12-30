import { type NextRequest, NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/sessions"

export async function POST(request: NextRequest) {
  try {
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
