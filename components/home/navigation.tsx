"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">NC</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline text-foreground">Namecheap Organics</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#featured" className="text-muted-foreground hover:text-foreground transition">
            Featured
          </Link>
          <Link href="#bestsellers" className="text-muted-foreground hover:text-foreground transition">
            Best Sellers
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition">
            About Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-card rounded-lg transition">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center text-background font-bold">
              0
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-card rounded-lg transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/auth/login" className="hidden sm:block">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login</Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="#featured" className="text-muted-foreground hover:text-foreground">
              Featured
            </Link>
            <Link href="#bestsellers" className="text-muted-foreground hover:text-foreground">
              Best Sellers
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="/auth/login">
              <Button className="w-full bg-primary hover:bg-primary/90">Login</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
