"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Promotion {
  id: number
  name: string
  description: string
  code: string
  auto_apply: boolean
  discount_type: string
  discount_value: number
  min_order_amount?: number
  product_ids?: number[]
  category?: string
  starts_at?: string
  ends_at?: string
  active: boolean
  usage_limit?: number
  usage_count: number
  max_discount?: number
  stackable: boolean
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    auto_apply: false,
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    category: "",
    starts_at: "",
    ends_at: "",
    active: true,
    usage_limit: "",
    max_discount: "",
    stackable: false,
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  async function fetchPromotions() {
    try {
      const response = await fetch("/api/promotions")
      const data = await response.json()
      setPromotions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch promotions:", error)
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      code: "",
      auto_apply: false,
      discount_type: "percentage",
      discount_value: "",
      min_order_amount: "",
      category: "",
      starts_at: "",
      ends_at: "",
      active: true,
      usage_limit: "",
      max_discount: "",
      stackable: false,
    })
    setEditingPromo(null)
    setShowForm(false)
  }

  function handleEdit(promo: Promotion) {
    setEditingPromo(promo)
    setFormData({
      name: promo.name,
      description: promo.description || "",
      code: promo.code,
      auto_apply: promo.auto_apply,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value.toString(),
      min_order_amount: promo.min_order_amount?.toString() || "",
      category: promo.category || "",
      starts_at: promo.starts_at ? new Date(promo.starts_at).toISOString().slice(0, 16) : "",
      ends_at: promo.ends_at ? new Date(promo.ends_at).toISOString().slice(0, 16) : "",
      active: promo.active,
      usage_limit: promo.usage_limit?.toString() || "",
      max_discount: promo.max_discount?.toString() || "",
      stackable: promo.stackable,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      name: formData.name,
      description: formData.description || null,
      code: formData.code,
      auto_apply: formData.auto_apply,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
      category: formData.category || null,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null,
      active: formData.active,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
      stackable: formData.stackable,
    }

    try {
      const url = editingPromo ? `/api/promotions/${editingPromo.id}` : "/api/promotions"
      const method = editingPromo ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        resetForm()
        fetchPromotions()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save promotion")
      }
    } catch (error) {
      console.error("Failed to save promotion:", error)
    }
  }

  async function handleDelete(promoId: number) {
    if (!confirm("Are you sure you want to delete this promotion?")) return

    try {
      const response = await fetch(`/api/promotions/${promoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPromotions()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete promotion")
      }
    } catch (error) {
      console.error("Failed to delete promotion:", error)
    }
  }

  async function toggleActive(promo: Promotion) {
    try {
      const response = await fetch(`/api/promotions/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promo.active }),
      })

      if (response.ok) {
        fetchPromotions()
      }
    } catch (error) {
      console.error("Failed to toggle promotion:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Promotions Management</h1>
        <Button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue"
        >
          {showForm ? "Cancel" : "+ Create Promotion"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 bg-card border-border neon-border-blue">
          <h2 className="text-xl font-bold mb-4">{editingPromo ? "Edit Promotion" : "Create New Promotion"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Promotion Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="text"
                placeholder="Promo Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="bg-input border-border text-foreground"
                required
              />
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="bg-input border border-border text-foreground p-2 rounded"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <Input
                type="number"
                placeholder={formData.discount_type === "percentage" ? "Discount %" : "Discount Amount"}
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="number"
                placeholder="Min Order Amount (optional)"
                step="0.01"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <Input
                type="number"
                placeholder="Max Discount (optional)"
                step="0.01"
                value={formData.max_discount}
                onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <Input
                type="text"
                placeholder="Category (optional)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <Input
                type="number"
                placeholder="Usage Limit (optional)"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <Input
                type="datetime-local"
                placeholder="Starts At"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <Input
                type="datetime-local"
                placeholder="Ends At"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input border border-border text-foreground p-2 rounded md:col-span-2"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.auto_apply}
                  onChange={(e) => setFormData({ ...formData, auto_apply: e.target.checked })}
                />
                <span>Auto-apply (no code needed)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.stackable}
                  onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                />
                <span>Stackable with other promos</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Active</span>
              </label>
            </div>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue w-full"
            >
              {editingPromo ? "Update Promotion" : "Create Promotion"}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card
            key={promo.id}
            className={`p-6 bg-card border-2 transition ${
              promo.active ? "border-primary neon-border-blue" : "border-border opacity-60"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-foreground">{promo.name}</h3>
              <button
                onClick={() => toggleActive(promo)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  promo.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {promo.active ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-secondary">
                  {promo.discount_type === "percentage" ? `${promo.discount_value}%` : `Rs ${promo.discount_value}`}
                </span>
                {promo.auto_apply && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                    AUTO-APPLY
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Code: <span className="font-mono font-bold text-foreground">{promo.code}</span>
              </div>
              {promo.description && (
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              )}
            </div>

            <div className="space-y-1 text-xs text-muted-foreground mb-4">
              {promo.min_order_amount && <div>Min Order: Rs {promo.min_order_amount}</div>}
              {promo.max_discount && <div>Max Discount: Rs {promo.max_discount}</div>}
              {promo.category && <div>Category: {promo.category}</div>}
              {promo.usage_limit && (
                <div>
                  Usage: {promo.usage_count} / {promo.usage_limit}
                </div>
              )}
              {promo.starts_at && <div>Starts: {new Date(promo.starts_at).toLocaleDateString()}</div>}
              {promo.ends_at && <div>Ends: {new Date(promo.ends_at).toLocaleDateString()}</div>}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleEdit(promo)} className="flex-1 bg-primary hover:bg-primary/90">
                Edit
              </Button>
              <Button onClick={() => handleDelete(promo.id)} className="flex-1 bg-destructive hover:bg-destructive/90">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
