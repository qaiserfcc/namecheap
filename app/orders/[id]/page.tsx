"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Truck, Package } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id?: number
  quantity: number
  price: number
  product: {
    name: string
    image_url?: string
  }
}

interface OrderEvent {
  id: number
  order_id: number
  status: string
  notes?: string
  created_at: string
}

interface Order {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  status: string
  total_amount: number
  discount_amount: number
  final_amount: number
  tracking_number?: string
  shipping_provider?: string
  expected_delivery?: string
  notes?: string
  created_at: string
  order_items: OrderItem[]
  order_events: OrderEvent[]
}

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: Package,
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400",
  confirmed: "text-blue-400",
  shipped: "text-purple-400",
  delivered: "text-green-400",
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  async function fetchOrder() {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setError("Order not found")
      }
    } catch (err) {
      setError("Failed to load order")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading order details...
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive mb-4">{error || "Order not found"}</p>
        <Link href="/cart">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Return to Cart
          </Button>
        </Link>
      </div>
    )
  }

  const sortedEvents = [...order.order_events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Success Message */}
      <Card className="p-6 bg-green-500/10 border border-green-500/20 mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckCircle size={24} className="text-green-400" />
          <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
        </div>
        <p className="text-muted-foreground">
          Order #{order.id} has been received and is being processed.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Info */}
        <Card className="p-6 bg-card border-border md:col-span-2">
          <h2 className="text-xl font-bold text-foreground mb-4">Order Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-semibold text-foreground">#{order.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-semibold text-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Status</span>
              <span className={`font-semibold uppercase tracking-wide ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>

            {order.tracking_number && (
              <>
                <div className="flex justify-between border-t border-border pt-3 mt-3">
                  <span className="text-muted-foreground">Tracking Number</span>
                  <span className="font-mono font-semibold text-foreground">
                    {order.tracking_number}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-semibold text-foreground">
                    {order.shipping_provider}
                  </span>
                </div>

                {order.expected_delivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Delivery</span>
                    <span className="font-semibold text-foreground">
                      {new Date(order.expected_delivery).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold text-foreground mb-4">Shipping To</h3>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">{order.customer_name}</p>
            <p className="text-muted-foreground break-words">{order.customer_email}</p>
            {order.customer_phone && (
              <p className="text-muted-foreground">{order.customer_phone}</p>
            )}
            <p className="text-muted-foreground mt-4">{order.shipping_address}</p>
          </div>
        </Card>
      </div>

      {/* Order Status Timeline */}
      <Card className="p-6 bg-card border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Order Status Timeline</h2>

        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const IconComponent = STATUS_ICONS[event.status] || Clock
            return (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`p-2 rounded-full bg-input ${STATUS_COLORS[event.status]}`}
                  >
                    <IconComponent size={20} />
                  </div>
                  {index < sortedEvents.length - 1 && (
                    <div className="w-0.5 h-12 bg-border my-2" />
                  )}
                </div>

                <div className="pt-1 pb-4">
                  <p className="font-semibold text-foreground uppercase text-sm">
                    {event.status}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.created_at).toLocaleDateString()} at{" "}
                    {new Date(event.created_at).toLocaleTimeString()}
                  </p>
                  {event.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{event.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6 bg-card border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>

        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-border rounded hover:bg-input/50 transition"
            >
              {item.product.image_url && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {item.product.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Quantity: {item.quantity} × Rs {item.price}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-foreground">
                  Rs {(item.quantity * item.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-6 bg-card border-border neon-border-blue">
        <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>Rs {(order.final_amount + order.discount_amount).toLocaleString()}</span>
          </div>

          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-400 font-semibold">
              <span>Discount</span>
              <span>−Rs {order.discount_amount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-bold text-lg">
            <span className="text-foreground">Total Amount</span>
            <span className="text-primary">Rs {order.final_amount.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
