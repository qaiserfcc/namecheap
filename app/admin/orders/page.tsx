"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OrderItem {
  id: number
  product_id: number
  name: string
  image_url: string
  quantity: number
  price: number
}

interface OrderEvent {
  id: number
  status: string
  notes: string
  created_at: string
}

interface Order {
  id: number
  user_id: number
  full_name: string
  email: string
  phone: string
  total_amount: number
  discount_amount?: number
  final_amount: number
  promotion_code?: string
  status: string
  town: string
  shipping_address: string
  tracking_number?: string
  shipping_provider?: string
  expected_delivery?: string
  notes?: string
  created_at: string
  items?: OrderItem[]
  events?: OrderEvent[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: "",
    shipping_provider: "",
    expected_delivery: "",
    notes: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }

  async function fetchOrderDetails(orderId: number) {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const order = await response.json()
      setSelectedOrder(order)
      setTrackingForm({
        tracking_number: order.tracking_number || "",
        shipping_provider: order.shipping_provider || "",
        expected_delivery: order.expected_delivery ? new Date(order.expected_delivery).toISOString().slice(0, 10) : "",
        notes: order.notes || "",
      })
    } catch (error) {
      console.error("Failed to fetch order details:", error)
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, eventNotes: `Status changed to ${newStatus}` }),
      })

      if (response.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          fetchOrderDetails(orderId)
        }
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  async function updateTracking(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOrder) return

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trackingForm,
          eventNotes: "Tracking information updated",
        }),
      })

      if (response.ok) {
        fetchOrders()
        fetchOrderDetails(selectedOrder.id)
        alert("Tracking information updated successfully")
      }
    } catch (error) {
      console.error("Failed to update tracking:", error)
    }
  }

  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Orders Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Orders</h2>
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`p-4 bg-card border-border hover:border-primary transition cursor-pointer ${
                selectedOrder?.id === order.id ? "border-primary neon-border-blue" : ""
              }`}
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-foreground">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary">Rs {order.final_amount?.toFixed(2) || order.total_amount.toFixed(2)}</p>
                  {order.discount_amount && order.discount_amount > 0 && (
                    <p className="text-xs text-green-400">-Rs {order.discount_amount.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={order.status}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateOrderStatus(order.id, e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 bg-input border border-border rounded text-foreground text-xs"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          {selectedOrder ? (
            <>
              <Card className="p-6 bg-card border-border neon-border-blue">
                <h2 className="text-xl font-bold mb-4">Order #{selectedOrder.id} Details</h2>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold">{selectedOrder.full_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping Address</p>
                    <p className="text-sm">{selectedOrder.shipping_address}</p>
                    <p className="text-sm">{selectedOrder.town}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>Rs {selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount && selectedOrder.discount_amount > 0 && (
                    <>
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({selectedOrder.promotion_code}):</span>
                        <span>-Rs {selectedOrder.discount_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Final Total:</span>
                        <span className="text-secondary">Rs {selectedOrder.final_amount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Order Items</h3>
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm">Rs {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-3">Tracking Information</h3>
                <form onSubmit={updateTracking} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Tracking Number"
                    value={trackingForm.tracking_number}
                    onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Shipping Provider"
                    value={trackingForm.shipping_provider}
                    onChange={(e) => setTrackingForm({ ...trackingForm, shipping_provider: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                  <Input
                    type="date"
                    placeholder="Expected Delivery"
                    value={trackingForm.expected_delivery}
                    onChange={(e) => setTrackingForm({ ...trackingForm, expected_delivery: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                  <textarea
                    placeholder="Notes"
                    value={trackingForm.notes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                    className="w-full bg-input border border-border text-foreground p-2 rounded"
                    rows={3}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Update Tracking
                  </Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {selectedOrder.events?.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold capitalize">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.notes}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">Select an order to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
