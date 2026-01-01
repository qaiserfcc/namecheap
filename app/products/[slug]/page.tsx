"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react"

interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

interface Variant {
  id: number
  sku: string
  attributes: Record<string, string>
  price_override?: number
  stock: number
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  stock_quantity?: number
  image_url?: string
  created_at: string
  product_images?: ProductImage[]
  images?: ProductImage[]
  product_variants?: Variant[]
  variants?: Variant[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`)
      if (response.ok) {
        const data = await response.json()
        // Normalize API response format
        const normalizedData = {
          ...data,
          product_images: data.product_images || data.images || [],
          product_variants: data.product_variants || data.variants || []
        }
        setProduct(normalizedData)
        if (normalizedData.product_variants && normalizedData.product_variants.length > 0) {
          setSelectedVariant(normalizedData.product_variants[0])
        }
      } else {
        setError("Product not found")
      }
    } catch (err) {
      setError("Failed to load product")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function nextImage() {
    if (product?.product_images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.product_images.length)
    }
  }

  function prevImage() {
    if (product?.product_images) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.product_images.length) % product.product_images.length
      )
    }
  }

  function handleAddToCart() {
    const cartItem = {
      product_id: product?.id,
      name: product?.name,
      price: selectedVariant?.price_override || product?.price,
      variant_id: selectedVariant?.id,
      variant_sku: selectedVariant?.sku,
      quantity,
      image_url: product?.product_images?.[0]?.image_url || product?.image_url,
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = cart.findIndex(
      (item: any) => item.product_id === cartItem.product_id && item.variant_id === cartItem.variant_id
    )

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Added to cart!")
    setQuantity(1)
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>{error || "Product not found"}</p>
      </div>
    )
  }

  const currentImage = product.product_images[selectedImageIndex]
  const displayPrice = selectedVariant?.price_override || product.price

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Image Carousel */}
        <div>
          <div className="relative bg-muted rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
            {currentImage ? (
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="text-muted-foreground">No image available</div>
            )}

            {product.product_images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.product_images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.product_images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded border-2 flex-shrink-0 ${
                    index === selectedImageIndex ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text}
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Category: {product.category}</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Price and Stock */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">Rs {displayPrice.toLocaleString()}</div>
            <div
              className={`px-4 py-2 rounded ${
                (selectedVariant?.stock || product.stock) > 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {(selectedVariant?.stock || product.stock) > 0 ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          {/* Variants */}
          {product.product_variants.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">Select Variant</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full p-3 rounded border-2 text-left transition ${
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{variant.sku}</p>
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </p>
                      </div>
                      {variant.price_override && (
                        <span className="text-sm font-semibold text-primary">
                          Rs {variant.price_override}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-foreground font-semibold">Quantity:</span>
            <div className="flex items-center border border-border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-input"
              >
                −
              </button>
              <span className="px-6 py-2 border-l border-r border-border text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-input"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={(selectedVariant?.stock || product.stock) <= 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue py-6 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </Button>

          {/* Additional Info */}
          <Card className="p-4 bg-input border-border">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-semibold text-foreground">{selectedVariant?.sku || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Stock:</span>
                <span className="font-semibold text-foreground">
                  {selectedVariant?.stock || product.stock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold text-foreground">{product.category}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
