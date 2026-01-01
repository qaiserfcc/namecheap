"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  stock_quantity?: number
  image_url?: string
  product_images?: Array<{ image_url: string; alt_text: string }>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])

        // Extract unique categories
        const cats = Array.from(
          new Set((Array.isArray(data) ? data : []).map((p: any) => p.category).filter(Boolean))
        ) as string[]
        setCategories(cats.filter(Boolean).sort())
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">All Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar: Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-border sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Search</h3>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-input"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-input"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-input rounded text-sm">
                <p className="text-muted-foreground">
                  Showing <span className="font-bold">{filteredProducts.length}</span> of{" "}
                  <span className="font-bold">{products.length}</span> products
                </p>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center text-muted-foreground py-12">
                Loading products...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const primaryImage = product.product_images?.[0]?.image_url || product.image_url

                  return (
                    <Card
                      key={product.id}
                      className="bg-card border-border hover:border-primary transition neon-border-blue overflow-hidden group"
                    >
                      {primaryImage && (
                        <div className="relative h-48 bg-muted overflow-hidden">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition"
                          />
                          {(product.stock === 0 || product.stock_quantity === 0) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <p className="text-white font-bold">Out of Stock</p>
                            </div>
                          )}
                          {((product.stock || product.stock_quantity || 0) < 10 && (product.stock || product.stock_quantity || 0) > 0) && (
                            <div className="absolute top-2 right-2 bg-yellow-500/80 text-black px-2 py-1 rounded text-xs font-semibold">
                              Only {product.stock || product.stock_quantity} left
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.category}
                        </p>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-primary">
                            Rs {product.price.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <span className="text-xs font-semibold">(42)</span>
                          </div>
                        </div>

                        <Link href={`/products/${product.id}`}>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? "Out of Stock" : "View Details"}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
