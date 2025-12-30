"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AdminNavbar() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary neon-glow-blue">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="border-border text-foreground bg-transparent">
          Logout
        </Button>
      </div>
    </nav>
  )
}
