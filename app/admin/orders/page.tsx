"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Order {
  id: number
  user_id: number
  full_name: string
  email: string
  phone: string
  total_amount: number
  status: string
  town: string
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

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

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const statuses = ["pending", "confirmed", "shipped", "delivered"]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Orders Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 bg-card border-border hover:border-primary transition neon-border-blue">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                <p className="font-semibold text-foreground">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Customer</p>
                <p className="font-semibold text-foreground">{order.full_name}</p>
                <p className="text-xs text-muted-foreground">{order.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="font-semibold text-secondary">Rs {order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">{order.town}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
