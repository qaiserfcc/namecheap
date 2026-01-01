import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "8")

    const result = await query(
      `SELECT * FROM vw_new_arrivals LIMIT $1`,
      [limit]
    )

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("New arrivals API error:", error)
    return NextResponse.json([])
  }
}
