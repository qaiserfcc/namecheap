"use client"

import type React from "react"
<<<<<<< HEAD

=======
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
<<<<<<< HEAD
=======
import Image from "next/image"

interface ProductImage {
  id?: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

interface ProductVariant {
  id?: number
  sku: string
  attributes: Record<string, string>
  price?: number
  stock: number
}
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
<<<<<<< HEAD
  stock_quantity: number
=======
  stock: number
  image_url: string
  images?: ProductImage[]
  variants?: ProductVariant[]
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
<<<<<<< HEAD
=======
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
<<<<<<< HEAD
    imageUrl: "",
    stock: "",
=======
    stock: "",
    images: [{ image_url: "", alt_text: "", is_primary: true, sort_order: 0 }] as ProductImage[],
    variants: [] as ProductVariant[],
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

<<<<<<< HEAD
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          imageUrl: formData.imageUrl,
          stock: Number.parseInt(formData.stock),
        }),
      })

      if (response.ok) {
        setFormData({ name: "", description: "", price: "", category: "", imageUrl: "", stock: "" })
        setShowForm(false)
        fetchProducts()
      }
    } catch (error) {
      console.error("Failed to add product:", error)
    }
  }

=======
  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [{ image_url: "", alt_text: "", is_primary: true, sort_order: 0 }],
      variants: [],
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  async function handleEditProduct(productId: number) {
    try {
      const response = await fetch(`/api/products/${productId}`)
      const product = await response.json()
      
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        images: product.images?.length > 0 ? product.images : [{ image_url: product.image_url || "", alt_text: "", is_primary: true, sort_order: 0 }],
        variants: product.variants || [],
      })
      setShowForm(true)
    } catch (error) {
      console.error("Failed to fetch product:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image_url: formData.images[0]?.image_url || "",
      images: formData.images.filter(img => img.image_url),
      variants: formData.variants,
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        resetForm()
        fetchProducts()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save product")
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  async function handleDeleteProduct(productId: number) {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  function addImageField() {
    setFormData({
      ...formData,
      images: [...formData.images, { image_url: "", alt_text: "", is_primary: false, sort_order: formData.images.length }],
    })
  }

  function removeImageField(index: number) {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  function addVariant() {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: "", attributes: {}, stock: 0 }],
    })
  }

  function removeVariant(index: number) {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
        <Button
<<<<<<< HEAD
          onClick={() => setShowForm(!showForm)}
=======
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
          className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 bg-card border-border neon-border-blue">
<<<<<<< HEAD
          <form onSubmit={handleAddProduct} className="space-y-4">
=======
          <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="number"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
<<<<<<< HEAD
              <Input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-input border-border text-foreground md:col-span-2"
              />
=======
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input border border-border text-foreground p-2 rounded md:col-span-2"
                rows={3}
              />
            </div>
<<<<<<< HEAD
=======

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Product Images</h3>
                <Button type="button" onClick={addImageField} className="text-sm">+ Add Image</Button>
              </div>
              {formData.images.map((img, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={img.image_url}
                    onChange={(e) => {
                      const newImages = [...formData.images]
                      newImages[idx].image_url = e.target.value
                      setFormData({ ...formData, images: newImages })
                    }}
                    className="col-span-6 bg-input border-border text-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Alt text"
                    value={img.alt_text || ""}
                    onChange={(e) => {
                      const newImages = [...formData.images]
                      newImages[idx].alt_text = e.target.value
                      setFormData({ ...formData, images: newImages })
                    }}
                    className="col-span-4 bg-input border-border text-foreground"
                  />
                  <label className="col-span-1 flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={img.is_primary}
                      onChange={(e) => {
                        const newImages = formData.images.map((image, i) => ({
                          ...image,
                          is_primary: i === idx ? e.target.checked : false,
                        }))
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                    Primary
                  </label>
                  {formData.images.length > 1 && (
                    <Button type="button" onClick={() => removeImageField(idx)} className="col-span-1 text-xs bg-destructive">×</Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Product Variants</h3>
                <Button type="button" onClick={addVariant} className="text-sm">+ Add Variant</Button>
              </div>
              {formData.variants.map((variant, idx) => (
                <div key={idx} className="border border-border rounded p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      type="text"
                      placeholder="SKU"
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...formData.variants]
                        newVariants[idx].sku = e.target.value
                        setFormData({ ...formData, variants: newVariants })
                      }}
                      className="col-span-4 bg-input border-border text-foreground"
                    />
                    <Input
                      type="number"
                      placeholder="Price (optional)"
                      value={variant.price || ""}
                      onChange={(e) => {
                        const newVariants = [...formData.variants]
                        newVariants[idx].price = e.target.value ? parseFloat(e.target.value) : undefined
                        setFormData({ ...formData, variants: newVariants })
                      }}
                      className="col-span-3 bg-input border-border text-foreground"
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) => {
                        const newVariants = [...formData.variants]
                        newVariants[idx].stock = parseInt(e.target.value) || 0
                        setFormData({ ...formData, variants: newVariants })
                      }}
                      className="col-span-3 bg-input border-border text-foreground"
                    />
                    <Button type="button" onClick={() => removeVariant(idx)} className="col-span-2 bg-destructive text-xs">Remove</Button>
                  </div>
                  <Input
                    type="text"
                    placeholder='Attributes (JSON, e.g., {"size": "M", "color": "Blue"})'
                    value={JSON.stringify(variant.attributes)}
                    onChange={(e) => {
                      try {
                        const newVariants = [...formData.variants]
                        newVariants[idx].attributes = JSON.parse(e.target.value)
                        setFormData({ ...formData, variants: newVariants })
                      } catch (err) {
                        // Invalid JSON, ignore
                      }
                    }}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              ))}
            </div>

>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue w-full"
            >
<<<<<<< HEAD
              Add Product
=======
              {editingProduct ? "Update Product" : "Add Product"}
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
            </Button>
          </form>
        </Card>
      )}

<<<<<<< HEAD
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-6 bg-card border-border hover:border-primary transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-secondary font-semibold">Rs {product.price}</span>
                  <span className="text-muted-foreground">{product.category}</span>
                  <span className="text-muted-foreground">Stock: {product.stock_quantity}</span>
                </div>
=======
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-card border-border hover:border-primary transition overflow-hidden">
            {product.image_url && (
              <div className="relative h-48 bg-muted">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
              <div className="flex gap-3 text-sm mb-4">
                <span className="text-secondary font-semibold">Rs {product.price}</span>
                <span className="text-muted-foreground">{product.category}</span>
                <span className="text-muted-foreground">Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditProduct(product.id)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </Button>
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
