"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/buyer/products")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card border-neon-blue border-2 neon-border-blue">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary neon-glow-blue mb-2">Namecheap Organics</h1>
        <p className="text-sm text-muted-foreground">Premium Organic Products</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-input border-border text-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-input border-border text-foreground"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 neon-glow-blue"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline font-semibold">
          Register here
        </Link>
      </div>

      <div className="mt-6 p-4 bg-card border border-neon-blue/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">ADMIN LOGIN:</p>
        <p className="text-xs text-muted-foreground mb-1">Email: admin@namecheap.com</p>
        <p className="text-xs text-muted-foreground">Password: admin123</p>
        <p className="text-xs text-yellow-400 mt-2 italic">
          Use these credentials to access the admin dashboard with full management features.
        </p>
      </div>
    </Card>
  )
}
