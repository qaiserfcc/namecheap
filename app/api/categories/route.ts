import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(`SELECT * FROM vw_category_stats`)

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json([])
  }
}
