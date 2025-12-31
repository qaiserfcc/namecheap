"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Zap } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  product_images: Array<{ image_url: string; alt_text: string }>
}

interface Promotion {
  id: number
  code: string
  discount_type: string
  discount_value: number
  description: string
  auto_apply: boolean
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [productsRes, promosRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/promotions"),
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(Array.isArray(data) ? data.slice(0, 6) : [])
      }

      if (promosRes.ok) {
        const data = await promosRes.json()
        setPromotions(
          Array.isArray(data)
            ? data.filter((p: any) => p.active).slice(0, 3)
            : []
        )
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-8 md:p-16 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Organic Products at 40% Less
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            100% certified organic, free shipping, 30-day guarantee, and 24/7 support
          </p>
          <div className="flex gap-4">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue px-8 py-6 text-lg">
                Shop Now
              </Button>
            </Link>
            <Link href="#promotions">
              <Button className="bg-input hover:bg-input/80 text-foreground px-8 py-6 text-lg">
                View Deals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Active Promotions */}
      {promotions.length > 0 && (
        <section id="promotions" className="p-8 md:p-16 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
              <Zap size={32} className="text-yellow-400" />
              Active Promotions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.map((promo) => {
                const discountDisplay =
                  promo.discount_type === "percentage"
                    ? `${promo.discount_value}% OFF`
                    : `Rs ${promo.discount_value} OFF`

                return (
                  <Card key={promo.id} className="p-6 bg-card border-border hover:border-primary transition neon-border-blue">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {discountDisplay}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {promo.description}
                    </p>
                    <div className="bg-input p-3 rounded mb-4">
                      <p className="text-xs text-muted-foreground">Code</p>
                      <p className="font-mono font-bold text-foreground">
                        {promo.code}
                      </p>
                    </div>
                    {promo.auto_apply && (
                      <div className="text-xs text-green-400 font-semibold mb-3">
                        ✓ Auto-Applied to Orders
                      </div>
                    )}
                    <Link href="/products">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Shop Now
                      </Button>
                    </Link>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="p-8 md:p-16 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Products</h2>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryImage = product.product_images[0]?.image_url

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
                        {product.stock < 10 && product.stock > 0 && (
                          <div className="absolute top-2 right-2 bg-yellow-500/80 text-black px-2 py-1 rounded text-xs font-semibold">
                            Low Stock
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
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No products available
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products">
              <Button
                className="bg-input hover:bg-input/80 text-foreground px-8 py-6"
                variant="outline"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="p-8 md:p-16 border-b border-border bg-input/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: "✓", title: "100% Organic", desc: "Certified organic products" },
              { icon: "🚚", title: "Free Shipping", desc: "On all orders" },
              { icon: "🛡️", title: "30-Day Guarantee", desc: "Money-back guarantee" },
              { icon: "💬", title: "24/7 Support", desc: "Customer support always available" },
            ].map((badge, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-bold text-foreground mb-1">{badge.title}</h4>
                <p className="text-sm text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-8 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Premium organic products delivered to your doorstep at unbeatable prices.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-muted-foreground hover:text-primary">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-muted-foreground hover:text-primary">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@namecheap.com" className="text-muted-foreground hover:text-primary">
                    support@namecheap.com
                  </a>
                </li>
                <li className="text-muted-foreground">+92 300 1234567</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Namecheap Organics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
