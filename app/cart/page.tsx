"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, ShoppingCart } from "lucide-react"
import { CartItemSkeleton } from "@/components/skeletons"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  product_id: number
  name: string
  price: number
  variant_id?: number
  variant_sku?: string
  quantity: number
  image_url: string
}

interface Promotion {
  id: number
  code: string
  discount_type: string
  discount_value: number
  max_discount?: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
  const [promoError, setPromoError] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCart()
  }, [])

  function loadCart() {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setCart(JSON.parse(saved))
    }
    setLoading(false)
  }

  function updateQuantity(productId: number, variantId: number | undefined, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, quantity }
          : item
      )
    )
    localStorage.setItem(
      "cart",
      JSON.stringify(
        cart.map((item) =>
          item.product_id === productId && item.variant_id === variantId
            ? { ...item, quantity }
            : item
        )
      )
    )
  }

  function removeFromCart(productId: number, variantId: number | undefined) {
    const updated = cart.filter(
      (item) => !(item.product_id === productId && item.variant_id === variantId)
    )
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    
    // Dispatch event for header cart count
    window.dispatchEvent(new Event("storage"))
    
    toast({
      title: "Item Removed",
      description: "Product has been removed from your cart"
    })
  }

  async function applyPromoCode(e: React.FormEvent) {
    e.preventDefault()
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`/api/promotions/validate?code=${encodeURIComponent(promoCode)}`)
      if (response.ok) {
        const promo = await response.json()
        setAppliedPromo(promo)
        setPromoError("")
        toast({
          title: "Promo Code Applied!",
          description: `You saved with code: ${promo.code}`
        })
      } else {
        setPromoError("Invalid or expired promo code")
        setAppliedPromo(null)
        toast({
          title: "Invalid Code",
          description: "This promo code is invalid or has expired",
          variant: "destructive"
        })
      }
    } catch (error) {
      setPromoError("Failed to validate promo code")
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to validate promo code",
        variant: "destructive"
      })
    }
  }

  function removePromo() {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  let discount = 0
  if (appliedPromo) {
    if (appliedPromo.discount_type === "percentage") {
      discount = (subtotal * appliedPromo.discount_value) / 100
      if (appliedPromo.max_discount) {
        discount = Math.min(discount, appliedPromo.max_discount)
      }
    } else {
      discount = appliedPromo.discount_value
    }
  }

  const total = Math.max(0, subtotal - discount)

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Browse our products and add items to your cart to get started.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={`${item.product_id}-${item.variant_id}`} className="p-4 bg-card border-border">
              <div className="flex gap-4">
                {item.image_url && (
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                      {item.name}
                    </h3>
                  </Link>

                  {item.variant_sku && (
                    <p className="text-sm text-muted-foreground mt-1">Variant: {item.variant_sku}</p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        className="px-2 py-1 border border-border rounded hover:bg-input"
                        title="Decrease quantity"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span className="px-4 text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                        className="px-2 py-1 border border-border rounded hover:bg-input"
                        title="Increase quantity"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Rs {item.price}</p>
                      <p className="font-semibold text-foreground">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id, item.variant_id)}
                      className="text-destructive hover:text-destructive/80 transition"
                      title="Remove from cart"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar: Promo Code & Summary */}
        <div className="space-y-4">
          {/* Promo Code */}
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">Promo Code</h3>

            {appliedPromo ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-sm font-semibold text-green-400">✓ Code Applied</p>
                  <p className="text-lg font-bold text-foreground mt-1">{appliedPromo.code}</p>
                  {appliedPromo.discount_type === "percentage" ? (
                    <p className="text-sm text-muted-foreground">
                      {appliedPromo.discount_value}% off
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Rs {appliedPromo.discount_value} off
                    </p>
                  )}
                </div>
                <Button
                  onClick={removePromo}
                  className="w-full bg-input hover:bg-input/80 text-foreground"
                >
                  Remove Promo Code
                </Button>
              </div>
            ) : (
              <form onSubmit={applyPromoCode} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-input border-border text-foreground"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Apply Code
                </Button>
                {promoError && <p className="text-sm text-destructive">{promoError}</p>}
              </form>
            )}
          </Card>

          {/* Order Summary */}
          <Card className="p-6 bg-card border-border neon-border-blue">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>−Rs {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">Rs {total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/">
              <Button className="w-full mt-2 bg-input hover:bg-input/80 text-foreground">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
        </div>
      </div>
    </>
  )
}
