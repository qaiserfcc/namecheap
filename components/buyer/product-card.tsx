"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 neon-border-blue group">
      <div className="relative h-48 bg-muted overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
        )}
        <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-secondary neon-glow-yellow">Rs {product.price}</span>
          <span className="text-xs text-muted-foreground">
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={product.stock_quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-2 border border-border rounded bg-input text-foreground text-center text-sm"
          />
          <Button
            onClick={() => onAddToCart(product, quantity)}
            disabled={product.stock_quantity === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}
