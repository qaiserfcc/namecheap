import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const orderId = Number.parseInt(params.id)

    const result = await query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, orderId],
    )

    return NextResponse.json(result[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 })
  }
}
