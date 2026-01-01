"use client"

<<<<<<< HEAD
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface User {
  id: number
  full_name: string
  email: string
  phone: string
=======
import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  name: string
  email: string
  role: string
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
<<<<<<< HEAD
=======
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  })
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474

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

<<<<<<< HEAD
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
=======
  function resetForm() {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "buyer",
    })
    setEditingUser(null)
    setShowForm(false)
  }

  function handleEdit(user: User) {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = editingUser
      ? {
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
          role: formData.role,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        resetForm()
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save user")
      }
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  async function handleDelete(userId: number) {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete user")
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <Button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue"
        >
          {showForm ? "Cancel" : "+ Add User"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 bg-card border-border neon-border-blue">
          <h2 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Add New User"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
              {!editingUser && (
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              )}
              {editingUser && (
                <Input
                  type="password"
                  placeholder="New Password (leave empty to keep current)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-input border border-border text-foreground p-2 rounded"
              >
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue w-full"
            >
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Email</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Role</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Joined</th>
              <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-input/50 transition">
                <td className="p-4 text-foreground font-medium">{user.name}</td>
                <td className="p-4 text-muted-foreground text-sm break-all">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Buyer"}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleEdit(user)}
                      className="bg-primary hover:bg-primary/90 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      className="bg-destructive hover:bg-destructive/90 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <Card className="p-12 bg-card border-border text-center">
          <p className="text-muted-foreground">No users found</p>
        </Card>
      )}
>>>>>>> c0d548507124f266e9960c5da55332c2d96d5474
    </div>
  )
}
