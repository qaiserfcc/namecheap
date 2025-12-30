"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface User {
  id: number
  full_name: string
  email: string
  phone: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Users Management</h1>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6 bg-card border-border hover:border-primary transition neon-border-blue">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-foreground">{user.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="font-semibold text-foreground">{user.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Joined</p>
                <p className="font-semibold text-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
