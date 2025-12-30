"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/products"),
      ])

      const orders = await ordersRes.json()
      const users = await usersRes.json()
      const products = await productsRes.json()

      const totalRevenue = Array.isArray(orders)
        ? orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)
        : 0

      setStats({
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalRevenue,
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalProducts: Array.isArray(products) ? products.length : 0,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: "🛍️", color: "primary" },
    { label: "Total Revenue", value: `Rs ${stats.totalRevenue.toFixed(2)}`, icon: "💰", color: "secondary" },
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "accent" },
    { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "primary" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6 bg-card border-border hover:border-primary transition neon-border-blue">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-2">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
