"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, disabled, className, initialPreview }: ImageUploadProps & { initialPreview?: string }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(initialPreview || null)

  // Sync preview with value if value looks like a URL
  React.useEffect(() => {
    if (value && (value.startsWith("http") || value.startsWith("data:"))) {
      setPreview(value)
    } else if (!value) {
      setPreview(null)
    }
  }, [value])

  // Sync with initialPreview when it changes
  React.useEffect(() => {
    if (initialPreview && !value?.startsWith("http") && !value?.startsWith("data:")) {
      setPreview(initialPreview)
    }
  }, [initialPreview, value])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    // If user types a URL, try to use it as preview
    if (e.target.value.startsWith("http")) {
      setPreview(e.target.value)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      
      // 1. Get upload URL
      const postUrl = await generateUploadUrl()
      
      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`)
      }
      
      const { storageId } = await result.json()
      
      // 3. Update value
      onChange(storageId)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
      setPreview(null) // Clear preview on error
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const clearImage = () => {
    onChange("")
    setPreview(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={handleUrlChange}
          placeholder="Image URL or upload file"
          disabled={disabled || isUploading}
          className="flex-1"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </div>

      {preview && (
        <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {!preview && value && !value.startsWith("http") && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
          <ImageIcon className="h-4 w-4" />
          <span>Image stored in Convex (ID: {value.substring(0, 10)}...)</span>
        </div>
      )}
    </div>
  )
}
