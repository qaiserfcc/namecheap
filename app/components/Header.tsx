"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <nav className="p-4 max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span>🌿</span>
          <span>Namecheap</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-foreground hover:text-primary transition"
          >
            Products
          </Link>
          <Link
            href="/admin"
            className="text-foreground hover:text-primary transition"
          >
            Admin
          </Link>
        </div>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-foreground hover:text-primary transition"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
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
        <div className="md:hidden border-t border-border p-4 space-y-3">
          <Link
            href="/"
            className="block text-foreground hover:text-primary transition py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block text-foreground hover:text-primary transition py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/admin"
            className="block text-foreground hover:text-primary transition py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
