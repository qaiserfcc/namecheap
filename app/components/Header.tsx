"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Heart, User, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserSession {
  id: number
  email: string
  role: string
}

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    updateCartCount()
    fetchUser()
    window.addEventListener("storage", updateCartCount)
    return () => window.removeEventListener("storage", updateCartCount)
  }, [])

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    setCartCount(count)
  }

  async function fetchUser() {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error("Error fetching user session:", error)
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        setUser(null)
        setShowUserMenu(false)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
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
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-foreground hover:text-secondary transition-colors font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* User Menu & Cart */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/wishlist"
                className="relative text-foreground hover:text-red-500 transition-colors hidden md:block"
                title="Wishlist"
              >
                <Heart size={24} />
              </Link>
              
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-foreground hover:text-secondary transition-colors"
                >
                  <User size={24} />
                  <span className="text-sm font-medium">{user.email}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border-2 border-secondary/30 rounded-lg shadow-lg z-50">
                    <div className="p-2 border-b border-secondary/30">
                      <p className="text-sm text-muted-foreground px-2 py-1">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground px-2">
                        Role: {user.role}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      {user.role === "buyer" && (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingCart size={16} />
                            My Orders
                          </Link>
                        </>
                      )}
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 rounded transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block bg-secondary text-black px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Login
            </Link>
          )}
          
          <Link
            href="/cart"
            className="relative text-foreground hover:text-primary transition-colors"
            title="Shopping Cart"
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
          
          {user ? (
            <>
              <Link
                href="/wishlist"
                className="block text-foreground hover:text-secondary transition-colors py-2 font-medium flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart size={18} />
                Wishlist
              </Link>
              {user.role === "buyer" && (
                <>
                  <Link
                    href="/profile"
                    className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="block text-foreground hover:text-secondary transition-colors py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left text-red-500 hover:text-red-400 transition-colors py-2 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="block bg-secondary text-black px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
