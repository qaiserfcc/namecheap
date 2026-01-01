"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: "buyer",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/buyer/products")
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-yellow-950/40 via-yellow-900/30 to-yellow-950/40 backdrop-blur-xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">
          Join Namecheap Organics
        </h1>
        <p className="text-sm text-yellow-100/70">Create your buyer account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Full Name</label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="bg-yellow-950/30 border-yellow-500/40 text-yellow-50 placeholder:text-yellow-300/40 focus:border-yellow-400 focus:ring-yellow-400/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="bg-yellow-950/30 border-yellow-500/40 text-yellow-50 placeholder:text-yellow-300/40 focus:border-yellow-400 focus:ring-yellow-400/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-yellow-950/30 border-yellow-500/40 text-yellow-50 placeholder:text-yellow-300/40 focus:border-yellow-400 focus:ring-yellow-400/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-yellow-100">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-yellow-100/70">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
          Login here
        </Link>
      </div>
    </Card>
  )
}
