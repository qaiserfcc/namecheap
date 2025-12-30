"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    address: "",
    town: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [],
          shippingAddress: formData.address,
          town: formData.town,
        }),
      })

      if (response.ok) {
        router.push("/buyer/products?checkout=success")
      } else {
        setError("Checkout failed")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 bg-card border-border neon-border-blue">
          <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

          {error && (
            <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Shipping Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your full address"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Town/City</label>
              <Input
                type="text"
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                placeholder="Your town or city"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your phone number"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 neon-glow-blue"
            >
              {loading ? "Processing..." : "Complete Order"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
