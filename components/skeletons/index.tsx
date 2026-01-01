"use client"

import { Card } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 border-border animate-pulse">
      <div className="relative aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-muted rounded" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="h-10 bg-muted rounded w-full mt-3" />
      </div>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="space-y-4 animate-pulse">
          <div className="relative bg-muted rounded-lg aspect-square" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-muted rounded border-2 border-border" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 bg-muted rounded w-32" />
            <div className="h-10 bg-muted rounded w-24" />
          </div>

          <Card className="p-6 bg-card border-border space-y-2">
            <div className="h-6 bg-muted rounded w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </Card>

          <div className="flex items-center gap-4">
            <div className="h-6 bg-muted rounded w-24" />
            <div className="h-10 bg-muted rounded w-32" />
          </div>

          <div className="h-12 bg-muted rounded w-full" />

          <Card className="p-4 bg-input border-border space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6 bg-card border-border animate-pulse">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-4 bg-muted rounded" />
                ))}
              </div>
              <div className="h-5 bg-muted rounded w-32" />
            </div>
            <div className="h-5 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-40" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <Card className="p-4 bg-card border-border animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-muted rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="flex items-center justify-between mt-4">
            <div className="h-8 bg-muted rounded w-24" />
            <div className="h-5 bg-muted rounded w-20" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export function OrderSkeleton() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
      <Card className="p-6 bg-card border-border space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded" />
        ))}
      </Card>
      <Card className="p-6 bg-card border-border space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded" />
        ))}
      </Card>
    </div>
  )
}
