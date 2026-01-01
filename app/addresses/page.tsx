"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Address {
  id: number
  user_id: number
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    is_default: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    try {
      const response = await fetch("/api/addresses")
      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }
      const data = await response.json()
      setAddresses(data)
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      is_default: false,
    })
    setIsEditing(false)
    setSelectedAddress(null)
  }

  function openAddDialog() {
    resetForm()
    setIsDialogOpen(true)
  }

  function openEditDialog(address: Address) {
    setSelectedAddress(address)
    setFormData({
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = isEditing && selectedAddress ? `/api/addresses/${selectedAddress.id}` : "/api/addresses"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save address")
      }

      const savedAddress = await response.json()

      if (isEditing) {
        setAddresses(addresses.map((a) => (a.id === savedAddress.id ? savedAddress : a)))
        toast({ title: "Success", description: "Address updated successfully" })
      } else {
        setAddresses([...addresses, savedAddress])
        toast({ title: "Success", description: "Address added successfully" })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error("Failed to delete address")
      }

      setAddresses(addresses.filter((a) => a.id !== id))
      toast({ title: "Success", description: "Address deleted successfully" })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  async function setDefaultAddress(id: number) {
    try {
      const response = await fetch(`/api/addresses/${id}/default`, { method: "PUT" })

      if (!response.ok) {
        throw new Error("Failed to set default address")
      }

      await fetchAddresses()
      toast({ title: "Success", description: "Default address updated" })
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Saved Addresses</h1>
              <p className="text-gray-400">Manage your delivery addresses</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {isEditing ? "Edit Address" : "Add New Address"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {isEditing ? "Update your address details" : "Add a new delivery address"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="street" className="text-gray-300">
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      value={formData.street_address}
                      onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-300">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postal" className="text-gray-300">
                        Postal Code
                      </Label>
                      <Input
                        id="postal"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="12345"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-300">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 mt-1"
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="default"
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="rounded border-slate-600 bg-slate-700"
                    />
                    <Label htmlFor="default" className="text-gray-300 cursor-pointer">
                      Set as default address
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? "Saving..." : isEditing ? "Update Address" : "Add Address"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {addresses.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50 text-center py-12">
              <div className="space-y-4">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto" />
                <h2 className="text-2xl font-bold text-white">No saved addresses</h2>
                <p className="text-gray-400 mb-6">Add your first address to get started</p>
                <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {address.street_address}
                          </h3>
                          {address.is_default && (
                            <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-gray-400">{address.country}</p>
                        <p className="text-gray-400">Phone: {address.phone}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(address)}
                          variant="outline"
                          className="border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(address.id)}
                          variant="outline"
                          className="border-red-600/20 text-red-400 hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {!address.is_default && (
                          <Button
                            onClick={() => setDefaultAddress(address.id)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-sm"
                          >
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
