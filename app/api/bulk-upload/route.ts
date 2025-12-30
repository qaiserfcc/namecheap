import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n")
    const headers = lines[0].split(",").map((h: string) => h.trim().toLowerCase())

    let uploadedCount = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",").map((v: string) => v.trim())
      const product: any = {}

      headers.forEach((header: string, index: number) => {
        product[header] = values[index]
      })

      try {
        await query(
          "INSERT INTO products (name, description, price, category, stock_quantity) VALUES ($1, $2, $3, $4, $5)",
          [
            product.name,
            product.description,
            Number.parseFloat(product.price),
            product.category,
            Number.parseInt(product.stock),
          ],
        )
        uploadedCount++
      } catch (error) {
        console.error("Error inserting product:", error)
      }
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedCount} products`,
      count: uploadedCount,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
