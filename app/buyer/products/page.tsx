"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/buyer/product-card"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity: number
}

interface CartItem extends Product {
  quantity: number
}

export default function BuyerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart(product: Product, quantity: number) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function handleRemoveFromCart(productId: number) {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  function handleCheckout() {
    if (cart.length === 0) return
    router.push("/checkout")
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))]
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary neon-glow-blue">Namecheap Organics</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-muted rounded-lg transition"
            >
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <Button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" })
                router.push("/auth/login")
              }}
              variant="outline"
              className="text-foreground border-border"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4 text-foreground">Categories</h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground neon-glow-blue"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedCategory} Products</h2>
                  <p className="text-muted-foreground">{filteredProducts.length} items available</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-card w-full max-w-sm h-full flex flex-col border-l border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="text-destructive text-sm">
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Rs {item.price}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="font-semibold text-secondary">Rs {item.price * item.quantity}</div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-secondary neon-glow-yellow">Rs {cartTotal.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue py-2"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
