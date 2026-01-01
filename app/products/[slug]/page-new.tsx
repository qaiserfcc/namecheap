"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Heart,
  Share2,
  Truck,
  Shield,
  Package,
  Check,
  Tag,
  TrendingUp
} from "lucide-react"

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
  brand_id?: number
}

interface RelatedProduct {
  id: number
  name: string
  price: number
  image_url: string
  category: string
  slug?: string
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
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [bundleProducts, setBundleProducts] = useState<RelatedProduct[]>([])
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description')

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
        
        // Set default variant
        if (normalizedData.product_variants && normalizedData.product_variants.length > 0) {
          setSelectedVariant(normalizedData.product_variants[0])
        }

        // Fetch related products
        fetchRelatedProducts(data.category, data.id)
        fetchBundleProducts(data.category, data.id)
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

  async function fetchRelatedProducts(category: string, currentId: number) {
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(category)}&limit=4`)
      if (response.ok) {
        const data = await response.json()
        const related = data.filter((p: any) => p.id !== currentId).slice(0, 4)
        setRelatedProducts(related)
      }
    } catch (err) {
      console.error("Failed to fetch related products:", err)
    }
  }

  async function fetchBundleProducts(category: string, currentId: number) {
    try {
      const response = await fetch(`/api/products?limit=3`)
      if (response.ok) {
        const data = await response.json()
        const bundle = data.filter((p: any) => p.id !== currentId).slice(0, 3)
        setBundleProducts(bundle)
      }
    } catch (err) {
      console.error("Failed to fetch bundle products:", err)
    }
  }

  function nextImage() {
    if (product?.product_images && product.product_images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.product_images!.length)
    }
  }

  function prevImage() {
    if (product?.product_images && product.product_images.length > 0) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.product_images!.length) % product.product_images!.length
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

  function calculateBundlePrice() {
    const productPrice = selectedVariant?.price_override || product?.price || 0
    const bundleTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0)
    return productPrice + bundleTotal
  }

  function calculateBundleDiscount() {
    const total = calculateBundlePrice()
    return Math.round(total * 0.1) // 10% discount
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-8 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading product...</p>
        </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="p-8 text-center text-destructive">
          <p>{error || "Product not found"}</p>
          <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
            ← Back to Products
          </Link>
        </div>
      </>
    )
  }

  const images = product.product_images || []
  const currentImage = images[selectedImageIndex]
  const displayPrice = selectedVariant?.price_override || product.price
  const currentStock = selectedVariant?.stock || product.stock || 0

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-card/80 rounded-2xl overflow-hidden aspect-square border-2 border-secondary/20 shadow-xl shadow-secondary/10">
                {currentImage ? (
                  <Image
                    src={currentImage.image_url}
                    alt={currentImage.alt_text}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Package size={64} className="opacity-30" />
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-secondary/90 hover:bg-secondary text-black p-3 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary/90 hover:bg-secondary text-black p-3 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Wishlist & Share */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all hover:scale-110">
                    <Heart size={20} />
                  </button>
                  <button className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all hover:scale-110">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                        index === selectedImageIndex 
                          ? "border-secondary shadow-lg shadow-secondary/30" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt_text}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Category & Stock Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full border border-primary/30">
                  {product.category}
                </span>
                {currentStock > 0 && currentStock <= 10 && (
                  <span className="px-3 py-1 bg-destructive/20 text-destructive text-sm font-medium rounded-full border border-destructive/30 animate-pulse">
                    Only {currentStock} left!
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-secondary text-secondary" />
                  ))}
                </div>
                <span className="text-muted-foreground">(4.8 • 234 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <div className="text-5xl font-bold text-secondary">
                  ₹{displayPrice.toLocaleString()}
                </div>
                {selectedVariant?.price_override && (
                  <div className="text-2xl text-muted-foreground line-through">
                    ₹{product.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  currentStock > 0
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                <Check size={20} />
                {currentStock > 0 ? `In Stock (${currentStock} available)` : "Out of Stock"}
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Variants Selector */}
              {product.product_variants && product.product_variants.length > 0 && (
                <Card className="p-6 bg-card/50 border-2 border-secondary/20 shadow-lg">
                  <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Tag className="text-secondary" size={20} />
                    Choose Your Variant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {product.product_variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                          selectedVariant?.id === variant.id
                            ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/20"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-foreground text-sm">{variant.sku}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Object.entries(variant.attributes)
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
                                .join(" • ")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Stock: {variant.stock}
                            </p>
                          </div>
                          {variant.price_override && (
                            <span className="text-sm font-bold text-secondary">
                              ₹{variant.price_override}
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
                <span className="text-foreground font-semibold text-lg">Quantity:</span>
                <div className="flex items-center border-2 border-secondary/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-secondary/20 transition-colors font-bold text-xl"
                  >
                    −
                  </button>
                  <span className="px-8 py-3 border-l border-r border-secondary/30 text-foreground font-bold text-xl min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-4 py-3 hover:bg-secondary/20 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-black py-7 text-xl font-bold rounded-xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart size={24} className="mr-2" />
                {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-secondary/20">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Truck className="text-primary" size={24} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over ₹1000</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <Shield className="text-green-400" size={24} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% Protected</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-secondary/20 rounded-full">
                      <Package className="text-secondary" size={24} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day guarantee</p>
                </div>
              </div>

              {/* Additional Product Info */}
              <Card className="p-4 bg-gradient-to-br from-card/80 to-card/50 border-2 border-primary/20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">SKU:</span>
                    <span className="font-bold text-foreground">{selectedVariant?.sku || product.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Category:</span>
                    <span className="font-bold text-primary">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">Available Stock:</span>
                    <span className="font-bold text-foreground">{currentStock} units</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs Section - Description, Details, Reviews */}
          <div className="mt-16">
            <div className="border-b-2 border-secondary/20">
              <div className="flex gap-8">
                {(['description', 'details', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-bold text-lg capitalize transition-all ${
                      activeTab === tab
                        ? "text-secondary border-b-4 border-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    {product.description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <Card className="p-6 bg-card/50 border-2 border-primary/20">
                      <h4 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Check className="text-primary" size={20} />
                        Key Features
                      </h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          100% Natural & Organic Ingredients
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          Cruelty-Free & Vegan Certified
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          Dermatologically Tested & Approved
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          No Harmful Chemicals or Parabens
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          Suitable for All Skin Types
                        </li>
                      </ul>
                    </Card>
                    <Card className="p-6 bg-card/50 border-2 border-secondary/20">
                      <h4 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Package className="text-secondary" size={20} />
                        What's Included
                      </h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          1x {product.name}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          User Manual & Instructions
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Quality Assurance Certificate
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Premium Packaging
                        </li>
                      </ul>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Detailed Information</h3>
                  <Card className="p-6 bg-card/50 border-2 border-primary/20">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-foreground mb-2">Specifications</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Brand:</span>
                              <span className="font-semibold text-foreground">NameCheap Organics</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="font-semibold text-foreground">{product.category}</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-semibold text-foreground">As per variant</span>
                            </div>
                            <div className="flex justify-between pb-2">
                              <span className="text-muted-foreground">Origin:</span>
                              <span className="font-semibold text-foreground">India</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-foreground mb-2">Usage Instructions</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-secondary mt-1">1.</span>
                              Cleanse the area before application
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-secondary mt-1">2.</span>
                              Apply appropriate amount as needed
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-secondary mt-1">3.</span>
                              Massage gently until absorbed
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-secondary mt-1">4.</span>
                              Use regularly for best results
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <Card key={review} className="p-6 bg-card/50 border-2 border-border">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center font-bold text-secondary">
                            U{review}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-foreground">User {review}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-secondary text-secondary" />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Amazing product! The quality is outstanding and I've seen great results. Highly recommend to everyone looking for natural products.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buy Together Bundle */}
          {bundleProducts.length > 0 && (
            <div className="mt-16">
              <Card className="p-8 bg-gradient-to-br from-secondary/10 via-card to-primary/10 border-2 border-secondary/30">
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <TrendingUp className="text-secondary" size={32} />
                  Frequently Bought Together
                </h2>
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  {/* Current Product */}
                  <div className="bg-card/80 p-4 rounded-xl border-2 border-primary/30">
                    <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={images[0]?.image_url || product.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
                    <p className="text-secondary font-bold">₹{displayPrice}</p>
                  </div>

                  {/* Bundle Products */}
                  {bundleProducts.map((bundleProduct) => (
                    <div key={bundleProduct.id} className="bg-card/80 p-4 rounded-xl border-2 border-border">
                      <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={bundleProduct.image_url || '/placeholder.png'}
                          alt={bundleProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-sm text-foreground truncate">{bundleProduct.name}</h4>
                      <p className="text-secondary font-bold">₹{bundleProduct.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Bundle Price: <span className="line-through">₹{calculateBundlePrice()}</span></p>
                    <p className="text-2xl font-bold text-secondary">
                      Save ₹{calculateBundleDiscount()} • Final Price: ₹{calculateBundlePrice() - calculateBundleDiscount()}
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-secondary to-primary text-black font-bold px-8 py-6 text-lg hover:scale-105 transition-all shadow-xl">
                    Add Bundle to Cart
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Package className="text-primary" size={32} />
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    href={`/products/${relProduct.slug || relProduct.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-2 border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                      <div className="aspect-square relative">
                        <Image
                          src={relProduct.image_url || '/placeholder.png'}
                          alt={relProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-4 bg-card">
                        <h3 className="font-semibold text-foreground mb-2 truncate">{relProduct.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary font-bold text-lg">₹{relProduct.price}</span>
                          <span className="text-xs text-muted-foreground">{relProduct.category}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
