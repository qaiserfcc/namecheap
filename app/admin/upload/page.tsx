"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a file")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setMessage(data.message || "File uploaded successfully")
      setFile(null)
    } catch (error) {
      setMessage("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Bulk Product Upload</h1>

      <Card className="p-8 bg-card border-border max-w-2xl neon-border-blue">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload CSV File</h2>
            <p className="text-sm text-muted-foreground mb-4">
              CSV should include columns: name, description, price, category, stock
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="bg-input border-border text-foreground"
            />
            {file && <p className="text-sm text-primary mt-2 neon-glow-blue">{file.name}</p>}
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.includes("failed") ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-blue py-2"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
