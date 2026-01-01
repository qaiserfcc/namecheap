"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { ProductGridSkeleton } from "@/components/skeletons"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  id: number
  product_id: number
  product_name: string
  product_description: string
  product_price: number
  product_category: string
  product_image: string
  stock_quantity: number
  average_rating?: number
  review_count?: number
  variant_id?: number
  variant_sku?: string
  variant_price?: number
  variant_stock?: number
  added_at: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchWishlist()
  }, [])

  async function fetchWishlist() {
    try {
      setLoading(true)
      const response = await fetch("/api/wishlist")
      
      if (response.status === 401) {
        setError("Please login to view your wishlist")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setWishlist(data)
      } else {
        setError("Failed to load wishlist")
      }
    } catch (error) {
      setError("Failed to load wishlist")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWishlist(productId: number, variantId?: number) {
    try {
      const url = variantId 
        ? `/api/wishlist?product_id=${productId}&variant_id=${variantId}`
        : `/api/wishlist?product_id=${productId}`
        
      const response = await fetch(url, { method: "DELETE" })

      if (response.ok) {
        setWishlist(prev => 
          prev.filter(item => 
            !(item.product_id === productId && 
              (variantId ? item.variant_id === variantId : !item.variant_id))
          )
        )
        
        toast({
          title: "Removed from Wishlist",
          description: "Product has been removed from your wishlist"
        })
      } else {
        throw new Error("Failed to remove from wishlist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive"
      })
    }
  }

  function addToCart(item: WishlistItem) {
    const cartItem = {
      product_id: item.product_id,
      name: item.product_name,
      price: item.variant_price || item.product_price,
      variant_id: item.variant_id,
      variant_sku: item.variant_sku,
      quantity: 1,
      image_url: item.product_image,
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = cart.findIndex(
      (cartItem: any) => 
        cartItem.product_id === item.product_id && 
        cartItem.variant_id === item.variant_id
    )

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("storage"))
    
    toast({
      title: "Added to Cart!",
      description: `${item.product_name} has been added to your cart`
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">My Wishlist</h1>
          <ProductGridSkeleton count={6} />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Wishlist</h1>
            <p className="text-destructive mb-6">{error}</p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Login to Continue
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (wishlist.length === 0) {
    return (
      <>
        <Header />
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Save items you love for later. Start adding products to your wishlist!
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const stock = item.variant_stock ?? item.stock_quantity
              const price = item.variant_price ?? item.product_price
              
              return (
                <Card 
                  key={`${item.product_id}-${item.variant_id || 'default'}`}
                  className="overflow-hidden hover:shadow-xl transition-all group border-2 border-border hover:border-primary/50"
                >
                  <Link href={`/products/${item.product_id}`}>
                    <div className="relative aspect-square overflow-hidden bg-card">
                      {item.product_image && (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      )}
                      {stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <p className="text-white font-bold">Out of Stock</p>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">{item.product_category}</p>
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition mb-2">
                        {item.product_name}
                      </h3>
                    </Link>

                    {item.variant_sku && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Variant: {item.variant_sku}
                      </p>
                    )}

                    {item.review_count && item.review_count > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.average_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({item.review_count})
                        </span>
                      </div>
                    )}

                    <div className="text-2xl font-bold text-secondary mb-4">
                      Rs. {price.toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={stock === 0}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => removeFromWishlist(item.product_id, item.variant_id)}
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
