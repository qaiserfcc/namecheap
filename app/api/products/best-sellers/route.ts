import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "8")

    const result = await query(
      `SELECT * FROM vw_best_sellers LIMIT $1`,
      [limit]
    )

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Best sellers API error:", error)
    return NextResponse.json([])
  }
}
