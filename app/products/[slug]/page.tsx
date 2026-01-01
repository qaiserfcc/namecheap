"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Share2, Package, Truck, Shield } from "lucide-react"
import ProductReviews from "@/components/reviews/ProductReviews"
import WishlistButton from "@/components/wishlist/WishlistButton"
import { ProductDetailSkeleton } from "@/components/skeletons"
import { useToast } from "@/hooks/use-toast"

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
  average_rating?: number
  review_count?: number
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
  const { toast } = useToast()

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
    
    // Dispatch storage event for cart count update
    window.dispatchEvent(new Event("storage"))
    
    toast({
      title: "Added to Cart!",
      description: `${product?.name} has been added to your cart`
    })
    
    setQuantity(1)
  }

  async function handleShare() {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: url
        })
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to clipboard"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive"
        })
      }
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <ProductDetailSkeleton />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">{error || "Product not found"}</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Products
            </Button>
          </Link>
        </div>
      </>
    )
  }

  const currentImage = product.product_images[selectedImageIndex]
  const displayPrice = selectedVariant?.price_override || product.price
  const displayStock = selectedVariant?.stock || product.stock

  return (
    <>
      <Header />
      <div className="p-4 md:p-8">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
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
            
            {/* Rating */}
            {product.review_count && product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.round(product.average_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground font-semibold">
                  {product.average_rating?.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2">
            <WishlistButton 
              productId={product.id} 
              variantId={selectedVariant?.id}
              size="lg"
              showText
            />
            <Button
              onClick={handleShare}
              variant="outline"
              size="lg"
              className="flex-1 border-border hover:border-primary"
            >
              <Share2 size={20} className="mr-2" />
              Share
            </Button>
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
                          {variant && variant.attributes
                            ? Object.entries(variant.attributes)
                                .filter(([, val]) => val !== null && val !== undefined)
                                .map(([key, val]: [string, any]) => {
                                  let displayValue = ''
                                  if (typeof val === 'string') {
                                    displayValue = val
                                  } else if (typeof val === 'number') {
                                    displayValue = String(val)
                                  } else if (typeof val === 'boolean') {
                                    displayValue = String(val)
                                  } else if (val && typeof val === 'object' && !Array.isArray(val)) {
                                    if ('value' in val) {
                                      displayValue = String((val as any).value)
                                    } else if ('label' in val) {
                                      displayValue = String((val as any).label)
                                    } else {
                                      try {
                                        displayValue = JSON.stringify(val)
                                      } catch {
                                        displayValue = 'N/A'
                                      }
                                    }
                                  }
                                  return displayValue ? `${key}: ${displayValue}` : null
                                })
                                .filter(Boolean)
                                .join(", ")
                            : "No attributes"}
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

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Secure Payment</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Fast Delivery</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <ProductReviews 
          productId={product.id} 
          averageRating={product.average_rating}
          reviewCount={product.review_count}
        />
      </div>
      </div>
    </>
  )
}
