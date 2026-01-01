"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X } from "lucide-react"

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    updateCartCount()
    window.addEventListener("storage", updateCartCount)
    return () => window.removeEventListener("storage", updateCartCount)
  }, [])

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    setCartCount(count)
  }

  return (
    <header className="border-b-2 border-secondary/30 bg-gradient-to-r from-card via-card to-card/95 sticky top-0 z-40 shadow-lg shadow-secondary/10">
      <nav className="p-4 max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.svg" alt="NameCheap Logo" width={160} height={48} priority className="h-12 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-secondary transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-foreground hover:text-secondary transition-colors font-medium"
          >
            Products
          </Link>
          <Link
            href="/admin"
            className="text-foreground hover:text-secondary transition-colors font-medium"
          >
            Admin
          </Link>
        </div>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg shadow-secondary/50">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-secondary/30 bg-card p-4 space-y-3">
          <Link
            href="/"
            className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/admin"
            className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
