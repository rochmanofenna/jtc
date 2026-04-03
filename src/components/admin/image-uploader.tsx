"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  images: string[]
  onChange: (urls: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  function addImage() {
    onChange([...images, ""])
  }

  function updateImage(index: number, url: string) {
    const updated = [...images]
    updated[index] = url
    onChange(updated)
    setErrors((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
    setErrors((prev) => {
      const next: Record<number, boolean> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const key = Number(k)
        if (key < index) next[key] = v
        else if (key > index) next[key - 1] = v
      })
      return next
    })
  }

  return (
    <div className="space-y-3">
      {images.map((url, index) => (
        <div key={index} className="flex items-start gap-3">
          {url && !errors[index] ? (
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="size-12 shrink-0 rounded-md border border-border object-cover"
              onError={() =>
                setErrors((prev) => ({ ...prev, [index]: true }))
              }
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
              IMG
            </div>
          )}
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => updateImage(index, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeImage(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addImage}>
        <Plus className="size-3.5" />
        Add Image
      </Button>
    </div>
  )
}
