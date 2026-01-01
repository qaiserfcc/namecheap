import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"
import { query } from "@/lib/db"
import { bulkUploadProductSchema } from "@/lib/validation"
import { applyRateLimit, RATE_LIMITS } from "@/lib/rateLimit"
import { ErrorResponses, secureJsonResponse, validateFileUpload } from "@/lib/security"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for bulk operations
    const limitResult = await applyRateLimit(request, RATE_LIMITS.BULK)
    if (limitResult.limited && limitResult.response) {
      return limitResult.response
    }

    // Verify admin access
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return ErrorResponses.unauthorized()
    }

    const contentType = request.headers.get("content-type") || ""

    // JSON payload support (for automated tests and API clients)
    if (contentType.includes("application/json")) {
      const body = await request.json()
      const products = Array.isArray(body?.products) ? body.products : []

      if (products.length === 0) {
        return ErrorResponses.validationError({ products: "No products provided" })
      }

      if (products.length > 1000) {
        return ErrorResponses.validationError({ products: "Maximum 1000 products allowed per upload" })
      }

      let uploadedCount = 0
      const errors: any[] = []

      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        
        // Validate each product
        const validation = bulkUploadProductSchema.safeParse(product)
        
        if (!validation.success) {
          errors.push({
            index: i,
            product: product.name || "Unknown",
            error: validation.error.format()
          })
          continue
        }

        try {
          await query(
            "INSERT INTO products (name, description, price, category, stock_quantity) VALUES ($1, $2, $3, $4, $5)",
            [
              validation.data.name,
              validation.data.description,
              validation.data.price,
              validation.data.category,
              validation.data.stock_quantity,
            ],
          )
          uploadedCount++
        } catch (error: any) {
          console.error("Error inserting product:", error)
          errors.push({
            index: i,
            product: validation.data.name,
            error: error.message
          })
        }
      }

      // Log bulk upload audit event
      await logAuditEvent({
        userId: session.userId,
        userEmail: session.email,
        action: "BULK_UPLOAD",
        entity: "PRODUCT",
        metadata: {
          totalProducts: products.length,
          uploadedCount,
          errorCount: errors.length,
          method: "json"
        },
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      })

      const response = secureJsonResponse({
        message: `Successfully uploaded ${uploadedCount} of ${products.length} products`,
        count: uploadedCount,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Return first 10 errors
        hasMoreErrors: errors.length > 10
      }, { status: uploadedCount > 0 ? 200 : 400 })

      // Add rate limit headers
      Object.entries(limitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    }

    // CSV upload path
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return ErrorResponses.validationError({ file: "No file provided" })
    }

    // Validate file
    try {
      validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["text/csv", "application/vnd.ms-excel"]
      })
    } catch (error: any) {
      return ErrorResponses.validationError({ file: error.message })
    }

    const text = await file.text()
    const lines = text.split("\n").filter(line => line.trim())
    
    if (lines.length < 2) {
      return ErrorResponses.validationError({ file: "CSV file must have headers and at least one data row" })
    }

    if (lines.length > 1001) { // 1 header + 1000 rows max
      return ErrorResponses.validationError({ file: "Maximum 1000 rows allowed per CSV upload" })
    }

    const headers = lines[0].split(",").map((h: string) => h.trim().toLowerCase())
    
    // Validate required headers
    const requiredHeaders = ["name", "price", "category"]
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    if (missingHeaders.length > 0) {
      return ErrorResponses.validationError({ 
        file: `Missing required CSV headers: ${missingHeaders.join(", ")}` 
      })
    }

    let uploadedCount = 0
    const errors: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",").map((v: string) => v.trim())
      const product: any = {}

      headers.forEach((header: string, index: number) => {
        product[header] = values[index] || ""
      })

      // Validate product data
      const validation = bulkUploadProductSchema.safeParse(product)
      
      if (!validation.success) {
        errors.push({
          row: i + 1,
          product: product.name || "Unknown",
          error: validation.error.format()
        })
        continue
      }

      try {
        await query(
          "INSERT INTO products (name, description, price, category, stock_quantity) VALUES ($1, $2, $3, $4, $5)",
          [
            validation.data.name,
            validation.data.description,
            validation.data.price,
            validation.data.category,
            validation.data.stock_quantity,
          ],
        )
        uploadedCount++
      } catch (error: any) {
        console.error("Error inserting product:", error)
        errors.push({
          row: i + 1,
          product: validation.data.name,
          error: error.message
        })
      }
    }

    // Log bulk upload audit event
    await logAuditEvent({
      userId: session.userId,
      userEmail: session.email,
      action: "BULK_UPLOAD",
      entity: "PRODUCT",
      metadata: {
        fileName: file.name,
        totalRows: lines.length - 1,
        uploadedCount,
        errorCount: errors.length,
        method: "csv"
      },
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    const response = secureJsonResponse({
      message: `Successfully uploaded ${uploadedCount} of ${lines.length - 1} products`,
      count: uploadedCount,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      hasMoreErrors: errors.length > 10
    }, { status: uploadedCount > 0 ? 200 : 400 })

    // Add rate limit headers
    Object.entries(limitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Bulk upload error:", error)
    return ErrorResponses.serverError("Upload failed")
  }
}
