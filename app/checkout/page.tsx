"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard, AlertCircle } from "lucide-react"

interface CartItem {
  product_id: number
  name: string
  price: number
  variant_sku?: string
  quantity: number
  image_url: string
}

interface OrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  promotion_code?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState<OrderData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
  })

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

  async function validatePromoCode() {
    if (!promoCode.trim()) {
      setPromoError("")
      setDiscount(0)
      return
    }

    try {
      const response = await fetch(`/api/promotions/validate?code=${encodeURIComponent(promoCode)}`)
      if (response.ok) {
        const promo = await response.json()
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        let calculatedDiscount = 0
        if (promo.discount_type === "percentage") {
          calculatedDiscount = (subtotal * promo.discount_value) / 100
          if (promo.max_discount) {
            calculatedDiscount = Math.min(calculatedDiscount, promo.max_discount)
          }
        } else {
          calculatedDiscount = promo.discount_value
        }

        setDiscount(calculatedDiscount)
        setPromoError("")
      } else {
        setPromoError("Invalid or expired promo code")
        setDiscount(0)
      }
    } catch (error) {
      setPromoError("Failed to validate promo code")
      console.error(error)
      setDiscount(0)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.customer_name || !formData.customer_email || !formData.shipping_address) {
      alert("Please fill in all required fields")
      return
    }

    setProcessing(true)

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        items: cart.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        promotion_code: promoCode || undefined,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })

      if (response.ok) {
        const order = await response.json()
        localStorage.removeItem("cart")
        router.push(`/orders/${order.id}?success=true`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Order creation failed:", error)
      alert("Failed to create order")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Math.max(0, subtotal - discount)

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                className="bg-input border-border text-foreground"
              />

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Shipping Address *
                </label>
                <textarea
                  placeholder="Enter your complete shipping address"
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  className="w-full p-3 bg-input border border-border rounded text-foreground"
                  rows={4}
                  required
                />
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded flex gap-3">
                <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Order will be processed with selected promo code</p>
                  {promoCode && (
                    <p>Current promo: <span className="font-semibold">{promoCode}</span></p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue py-6 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                {processing ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Promo Code */}
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">Promo Code</h3>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onBlur={validatePromoCode}
                className="bg-input border-border text-foreground"
              />
              {promoCode && !promoError && discount > 0 && (
                <p className="text-sm text-green-400 font-semibold">✓ Code applied successfully</p>
              )}
              {promoError && <p className="text-sm text-destructive">{promoError}</p>}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 bg-card border-border neon-border-blue">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.product_id}-${item.variant_id}`} className="text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="truncate">{item.name}</span>
                    <span className="ml-2">x{item.quantity}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-xs text-muted-foreground">Rs {item.price}</span>
                    <span className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-border pt-4 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Discount</span>
                  <span>−Rs {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">Rs {total.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
