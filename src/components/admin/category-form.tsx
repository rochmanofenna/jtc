"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { slugify } from "@/lib/utils"

interface CategoryFormProps {
  initialData?: any
  categories: any[]
}

const NONE_VALUE = "__none__"

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name ?? "")
  const [nameCn, setNameCn] = useState(initialData?.nameCn ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [icon, setIcon] = useState(initialData?.icon ?? "")
  const [sortOrder, setSortOrder] = useState<string>(
    initialData?.sortOrder != null ? String(initialData.sortOrder) : "0"
  )
  const [parentId, setParentId] = useState(initialData?.parentId ?? NONE_VALUE)
  const [submitting, setSubmitting] = useState(false)

  function handleNameBlur() {
    if (!slug && name) {
      setSlug(slugify(name))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const body: Record<string, unknown> = {
      name,
      nameCn: nameCn || undefined,
      slug: slug || slugify(name),
      icon: icon || undefined,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      parentId: parentId === NONE_VALUE ? undefined : parentId,
    }

    try {
      const url = isEdit
        ? `/api/categories/${initialData.id}`
        : "/api/categories"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to save category")
      }

      toast.success(isEdit ? "Category updated" : "Category created")
      router.push("/admin/categories")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  // Filter out current category from parent options to prevent self-reference
  const parentOptions = categories.filter(
    (cat) => cat.id !== initialData?.id
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name / Name CN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Safety Helmets"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameCn">Name (Chinese)</Label>
          <Input
            id="nameCn"
            value={nameCn}
            onChange={(e) => setNameCn(e.target.value)}
            placeholder="\u5B89\u5168\u5E3D"
          />
        </div>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="safety-helmets"
        />
        <p className="text-xs text-muted-foreground">
          Auto-generated from name if left empty.
        </p>
      </div>

      {/* Icon / Sort Order */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="HardHat"
          />
          <p className="text-xs text-muted-foreground">
            Lucide icon name (e.g. HardHat, Shield, Package)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select value={parentId} onValueChange={setParentId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None (top-level)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>None (top-level)</SelectItem>
            {parentOptions.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Category"
              : "Save Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
