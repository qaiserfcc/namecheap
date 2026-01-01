"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Lock, Mail, User, LogOut } from "lucide-react"

interface UserProfile {
  id: number
  email: string
  full_name: string
  phone?: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  async function fetchUserProfile() {
    try {
      const response = await fetch("/api/auth/profile")
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login")
          return
        }
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setUser(data)
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        email: data.email || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingProfile(true)

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to change password")
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Success",
        description: "Password changed successfully",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleAccountDeletion() {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      toast({
        title: "Success",
        description: "Your account has been deleted",
      })

      // Clear localStorage and redirect to home
      localStorage.removeItem("cart")
      localStorage.removeItem("wishlist")
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("cart")
      localStorage.removeItem("wishlist")
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-900/20 bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-red-400">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Failed to load profile. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
            <p className="text-gray-400">Manage your profile and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
              <TabsTrigger value="profile" className="text-gray-400 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="text-gray-400 data-[state=active]:text-white">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="account" className="text-gray-400 data-[state=active]:text-white">
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Full Name</Label>
                        <p className="text-white mt-1 text-lg font-semibold">{user.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <p className="text-white mt-1 text-lg font-semibold">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <p className="text-white mt-1 text-lg font-semibold">{user.phone || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Account Type</Label>
                        <p className="text-white mt-1 text-lg font-semibold capitalize">{user.role}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Member Since</Label>
                        <p className="text-white mt-1 text-lg font-semibold">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-gray-300">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isSavingProfile}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-slate-600 text-gray-300 hover:bg-slate-700 flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-gray-300">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-gray-300">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="Enter new password"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6 mt-6">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>

                  <div className="border-t border-slate-700 pt-4">
                    <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                    <Button
                      onClick={handleAccountDeletion}
                      disabled={isDeleting}
                      className="w-full bg-red-900 hover:bg-red-800 text-red-100"
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      This action is permanent and cannot be undone. All your data will be deleted.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
