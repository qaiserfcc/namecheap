"use client"

import { useEffect, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface Order {
  id: number
  user_id: number
  total_amount: number
  status: string
  created_at: string
  shipping_address: string
  town: string
}

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  revenueGrowth: number
  ordersGrowth: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("all")

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  async function fetchStats() {
    setLoading(true)
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/products"),
      ])

      const orders = await ordersRes.json()
      const users = await usersRes.json()
      const products = await productsRes.json()

      const ordersArray = Array.isArray(orders) ? orders : []
      const totalRevenue = ordersArray.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)
      
      const pendingOrders = ordersArray.filter((o: any) => o.status === "pending").length
      const completedOrders = ordersArray.filter((o: any) => o.status === "completed").length

      setStats({
        totalOrders: ordersArray.length,
        totalRevenue,
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalProducts: Array.isArray(products) ? products.length : 0,
        pendingOrders,
        completedOrders,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
      })

      setRecentOrders(ordersArray.slice(0, 5))
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `Rs ${stats.totalRevenue.toFixed(2)}`,
        icon: DollarSign,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        growth: stats.revenueGrowth,
        trend: stats.revenueGrowth >= 0 ? "up" : "down",
      },
      {
        title: "Total Orders",
        value: stats.totalOrders.toString(),
        icon: ShoppingCart,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        growth: stats.ordersGrowth,
        trend: stats.ordersGrowth >= 0 ? "up" : "down",
      },
      {
        title: "Total Users",
        value: stats.totalUsers.toString(),
        icon: Users,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        growth: 0,
        trend: "neutral" as const,
      },
      {
        title: "Total Products",
        value: stats.totalProducts.toString(),
        icon: Package,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        growth: 0,
        trend: "neutral" as const,
      },
    ],
    [stats]
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            {(["today", "week", "month", "all"] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                className="capitalize"
              >
                {range === "all" ? "All Time" : range}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
                  {stat.trend !== "neutral" && (
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {Math.abs(stat.growth)}%
                      </span>
                      <span className="text-muted-foreground">vs last period</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Pending Orders</h3>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{stats.pendingOrders}</p>
            <p className="text-sm text-muted-foreground">Awaiting processing</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Completed Orders</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{stats.completedOrders}</p>
            <p className="text-sm text-muted-foreground">Successfully delivered</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Avg Order Value</h3>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">
              Rs {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Per order</p>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Recent Orders
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Town</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-semibold text-foreground">#{order.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground text-sm">User {order.user_id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-foreground">Rs {order.total_amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{order.town || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <Package className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Manage Products</h3>
            <p className="text-sm text-muted-foreground mb-4">Add, edit or remove products from inventory</p>
            <Button variant="outline" size="sm" className="w-full">
              Go to Products
            </Button>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <ShoppingCart className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Process Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">View and manage customer orders</p>
            <Button variant="outline" size="sm" className="w-full">
              Go to Orders
            </Button>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground mb-4">View and manage registered users</p>
            <Button variant="outline" size="sm" className="w-full">
              Go to Users
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
