"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Package, ChevronRight } from "lucide-react"

interface Order {
  id: number
  order_number: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  item_count: number
  estimated_delivery?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const { toast } = useToast()

  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [searchTerm, statusFilter, orders])

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Error",
            description: "Please login to view your orders",
            variant: "destructive",
          })
          return
        }
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function filterOrders() {
    let filtered = [...orders]

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-900/20 text-yellow-200"
      case "processing":
        return "bg-blue-900/20 text-blue-200"
      case "shipped":
        return "bg-purple-900/20 text-purple-200"
      case "delivered":
        return "bg-green-900/20 text-green-200"
      case "cancelled":
        return "bg-red-900/20 text-red-200"
      default:
        return "bg-gray-900/20 text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-gray-400">{orders.length} total orders</p>
          </div>

          {orders.length > 0 && (
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search by order number or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setStatusFilter("")}
                  variant={statusFilter === "" ? "default" : "outline"}
                  className={`${
                    statusFilter === ""
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-slate-600 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  All Orders
                </Button>
                {statuses.map((status) => (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? "default" : "outline"}
                    className={`${
                      statusFilter === status
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50 text-center py-12">
              <div className="space-y-4">
                <Package className="w-16 h-16 text-gray-600 mx-auto" />
                <h2 className="text-2xl font-bold text-white">
                  {orders.length === 0 ? "No orders yet" : "No orders match your search"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {orders.length === 0
                    ? "Start shopping to place your first order"
                    : "Try a different search or filter"}
                </p>
                {orders.length === 0 && (
                  <Link href="/products">
                    <Button className="bg-blue-600 hover:bg-blue-700">Browse Products</Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <Card className="border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              Order {order.order_number}
                            </h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Order Date</p>
                              <p className="text-white font-medium">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Items</p>
                              <p className="text-white font-medium">{order.item_count}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Total Amount</p>
                              <p className="text-white font-medium">₹{order.total_amount.toFixed(2)}</p>
                            </div>
                            {order.estimated_delivery && (
                              <div>
                                <p className="text-gray-400">Est. Delivery</p>
                                <p className="text-white font-medium">
                                  {new Date(order.estimated_delivery).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
