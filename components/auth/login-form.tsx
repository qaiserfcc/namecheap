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

  function fillAdminCredentials() {
    setEmail("admin@cheapname.tyo")
    setPassword("password123")
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-yellow-950/40 via-yellow-900/30 to-yellow-950/40 backdrop-blur-xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">
          Namecheap Organics
        </h1>
        <p className="text-sm text-yellow-100/70">Premium Organic Products</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-yellow-950/30 border-yellow-500/40 text-yellow-50 placeholder:text-yellow-300/40 focus:border-yellow-400 focus:ring-yellow-400/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-yellow-950/30 border-yellow-500/40 text-yellow-50 placeholder:text-yellow-300/40 focus:border-yellow-400 focus:ring-yellow-400/50"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-yellow-950 font-semibold py-3 shadow-lg shadow-yellow-500/30 border border-yellow-400/50"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-yellow-100/70">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
          Register here
        </Link>
      </div>

      <div className="mt-6 p-4 bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-200/90 mb-3 font-semibold">ADMIN QUICK LOGIN</p>
        <Button
          type="button"
          onClick={fillAdminCredentials}
          className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-500/40 font-medium text-sm py-2"
        >
          Auto-Fill Admin Credentials
        </Button>
        <p className="text-xs text-yellow-300/60 mt-2 italic">
          Click to auto-fill: admin@cheapname.tyo / password123
        </p>
      </div>
    </Card>
  )
}
