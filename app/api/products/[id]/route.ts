import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

// GET /api/products/[id] - get product with images and variants
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const productId = parseInt(resolvedParams.id)
    
    const productResult = await query(`SELECT * FROM products WHERE id = $1`, [productId])
    
    if (!productResult || productResult.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = productResult[0]

    // Fetch images
    const images = await query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
      [productId]
    )

    // Fetch variants
    const variants = await query(
      `SELECT * FROM product_variants WHERE product_id = $1 ORDER BY id ASC`,
      [productId]
    )

    return NextResponse.json({
      ...product,
      product_images: Array.isArray(images) ? images : [],
      product_variants: Array.isArray(variants) ? variants : [],
      // Keep legacy fields for compatibility
      images: Array.isArray(images) ? images : [],
      variants: Array.isArray(variants) ? variants : []
    })
  } catch (error: any) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 })
  }
}

// PATCH /api/products/[id] - update product with images and variants (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const productId = parseInt(resolvedParams.id)
    const updates = await request.json()

    // Update product fields
    const productFields: string[] = []
    const productValues: any[] = []
    let idx = 1

    const allowedFields = ['name', 'description', 'price', 'category', 'brand_id', 'stock', 'image_url']

    for (const key of allowedFields) {
      if (key in updates) {
        productFields.push(`${key} = $${idx}`)
        productValues.push(updates[key])
        idx++
      }
    }

    if (productFields.length > 0) {
      productFields.push(`updated_at = CURRENT_TIMESTAMP`)
      productValues.push(productId)

      await query(
        `UPDATE products SET ${productFields.join(', ')} WHERE id = $${idx}`,
        productValues
      )
    }

    // Handle images if provided
    if (updates.images && Array.isArray(updates.images)) {
      // Delete existing images not in the new list
      const imageIds = updates.images.filter((img: any) => img.id).map((img: any) => img.id)
      if (imageIds.length > 0) {
        await query(
          `DELETE FROM product_images WHERE product_id = $1 AND id NOT IN (${imageIds.map((_: any, i: number) => `$${i + 2}`).join(',')})`,
          [productId, ...imageIds]
        )
      } else {
        await query(`DELETE FROM product_images WHERE product_id = $1`, [productId])
      }

      // Insert or update images
      for (const img of updates.images) {
        if (img.id) {
          // Update existing
          await query(
            `UPDATE product_images SET image_url = $1, alt_text = $2, is_primary = $3, sort_order = $4 WHERE id = $5`,
            [img.image_url, img.alt_text || null, img.is_primary || false, img.sort_order || 0, img.id]
          )
        } else {
          // Insert new
          await query(
            `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES ($1, $2, $3, $4, $5)`,
            [productId, img.image_url, img.alt_text || null, img.is_primary || false, img.sort_order || 0]
          )
        }
      }
    }

    // Handle variants if provided
    if (updates.variants && Array.isArray(updates.variants)) {
      // Delete existing variants not in the new list
      const variantIds = updates.variants.filter((v: any) => v.id).map((v: any) => v.id)
      if (variantIds.length > 0) {
        await query(
          `DELETE FROM product_variants WHERE product_id = $1 AND id NOT IN (${variantIds.map((_: any, i: number) => `$${i + 2}`).join(',')})`,
          [productId, ...variantIds]
        )
      } else {
        await query(`DELETE FROM product_variants WHERE product_id = $1`, [productId])
      }

      // Insert or update variants
      for (const variant of updates.variants) {
        if (variant.id) {
          // Update existing
          await query(
            `UPDATE product_variants SET sku = $1, attributes = $2, price = $3, stock = $4 WHERE id = $5`,
            [variant.sku, JSON.stringify(variant.attributes || {}), variant.price || null, variant.stock || 0, variant.id]
          )
        } else {
          // Insert new
          await query(
            `INSERT INTO product_variants (product_id, sku, attributes, price, stock) VALUES ($1, $2, $3, $4, $5)`,
            [productId, variant.sku, JSON.stringify(variant.attributes || {}), variant.price || null, variant.stock || 0]
          )
        }
      }
    }

    // Return updated product with images and variants
    const product = await query(`SELECT * FROM products WHERE id = $1`, [productId])
    const images = await query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
      [productId]
    )
    const variants = await query(
      `SELECT * FROM product_variants WHERE product_id = $1 ORDER BY id ASC`,
      [productId]
    )

    return NextResponse.json({
      ...product[0],
      images,
      variants
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - delete product (admin only, cascades to images and variants)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionToken = await getSessionCookie()
    const session = await verifySession(sessionToken!)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = parseInt(params.id)

    // Delete images (cascade)
    await query(`DELETE FROM product_images WHERE product_id = $1`, [productId])
    
    // Delete variants (cascade)
    await query(`DELETE FROM product_variants WHERE product_id = $1`, [productId])
    
    // Delete product
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id`, [productId])

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}
