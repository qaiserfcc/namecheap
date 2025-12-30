import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      "SELECT id, email, full_name, phone, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC",
      ["buyer"],
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
