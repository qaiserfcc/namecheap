"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  productId: number
  variantId?: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function WishlistButton({
  productId,
  variantId,
  size = "md",
  showText = false
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkWishlistStatus()
  }, [productId, variantId])

  async function checkWishlistStatus() {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const wishlist = await response.json()
        const inWishlist = wishlist.some(
          (item: any) =>
            item.product_id === productId &&
            (variantId ? item.variant_id === variantId : !item.variant_id)
        )
        setIsInWishlist(inWishlist)
      }
    } catch (error) {
      // User might not be logged in
      console.log("Could not check wishlist status")
    }
  }

  async function toggleWishlist() {
    setLoading(true)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(
          `/api/wishlist?product_id=${productId}${variantId ? `&variant_id=${variantId}` : ""}`,
          { method: "DELETE" }
        )

        if (response.ok) {
          setIsInWishlist(false)
          toast({
            title: "Removed from Wishlist",
            description: "Product has been removed from your wishlist"
          })
        } else {
          const data = await response.json()
          throw new Error(data.error || "Failed to remove from wishlist")
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            variant_id: variantId
          })
        })

        const data = await response.json()

        if (response.ok) {
          setIsInWishlist(true)
          toast({
            title: "Added to Wishlist",
            description: data.message || "Product has been added to your wishlist"
          })
        } else {
          if (response.status === 401) {
            toast({
              title: "Login Required",
              description: "Please login to add items to your wishlist",
              variant: "destructive"
            })
          } else {
            throw new Error(data.error || "Failed to add to wishlist")
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20
  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default"

  return (
    <Button
      onClick={toggleWishlist}
      disabled={loading}
      variant={isInWishlist ? "default" : "outline"}
      size={buttonSize}
      className={
        isInWishlist
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
          : "border-border hover:border-red-500 hover:text-red-500"
      }
    >
      <Heart
        size={iconSize}
        className={isInWishlist ? "fill-current" : ""}
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  )
}
