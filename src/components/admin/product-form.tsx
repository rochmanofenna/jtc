"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploader } from "./image-uploader"
import { slugify } from "@/lib/utils"

interface ProductFormProps {
  initialData?: any
  categories: any[]
  suppliers: any[]
}

export function ProductForm({
  initialData,
  categories,
  suppliers,
}: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name ?? "")
  const [nameCn, setNameCn] = useState(initialData?.nameCn ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  )
  const [descriptionCn, setDescriptionCn] = useState(
    initialData?.descriptionCn ?? ""
  )
  const [material, setMaterial] = useState(initialData?.material ?? "")
  const [materialCn, setMaterialCn] = useState(initialData?.materialCn ?? "")
  const [specifications, setSpecifications] = useState(
    initialData?.specifications ?? ""
  )
  const [packaging, setPackaging] = useState(initialData?.packaging ?? "")
  const [moq, setMoq] = useState<string>(
    initialData?.moq != null ? String(initialData.moq) : ""
  )
  const [unit, setUnit] = useState(initialData?.unit ?? "")
  const [brandName, setBrandName] = useState(initialData?.brandName ?? "")
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "")
  const [supplierId, setSupplierId] = useState(initialData?.supplierId ?? "")
  const [colors, setColors] = useState<string[]>(initialData?.colors ?? [])
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes ?? [])
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) ?? []
  )
  const [colorInput, setColorInput] = useState("")
  const [sizeInput, setSizeInput] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function handleNameBlur() {
    if (!slug && name) {
      setSlug(slugify(name))
    }
  }

  function handleColorKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      const trimmed = colorInput.trim()
      if (trimmed && !colors.includes(trimmed)) {
        setColors([...colors, trimmed])
      }
      setColorInput("")
    }
  }

  function handleSizeKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      const trimmed = sizeInput.trim()
      if (trimmed && !sizes.includes(trimmed)) {
        setSizes([...sizes, trimmed])
      }
      setSizeInput("")
    }
  }

  function removeColor(color: string) {
    setColors(colors.filter((c) => c !== color))
  }

  function removeSize(size: string) {
    setSizes(sizes.filter((s) => s !== size))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const body: Record<string, unknown> = {
      name,
      nameCn: nameCn || undefined,
      slug: slug || slugify(name),
      description: description || undefined,
      descriptionCn: descriptionCn || undefined,
      material: material || undefined,
      materialCn: materialCn || undefined,
      specifications: specifications || undefined,
      packaging: packaging || undefined,
      moq: moq ? Number(moq) : undefined,
      unit: unit || undefined,
      brandName: brandName || undefined,
      isActive,
      categoryId,
      supplierId,
      colors,
      sizes,
      images: images.filter(Boolean),
    }

    try {
      const url = isEdit
        ? `/api/products/${initialData.id}`
        : "/api/products"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to save product")
      }

      toast.success(isEdit ? "Product updated" : "Product created")
      router.push("/admin/products")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name / Name CN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Safety Helmet Type A"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameCn">Name (Chinese)</Label>
          <Input
            id="nameCn"
            value={nameCn}
            onChange={(e) => setNameCn(e.target.value)}
            placeholder="\u5B89\u5168\u5E3DA\u578B"
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
          placeholder="safety-helmet-type-a"
        />
        <p className="text-xs text-muted-foreground">
          Auto-generated from name if left empty.
        </p>
      </div>

      {/* Description / Description CN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionCn">Description (Chinese)</Label>
          <Textarea
            id="descriptionCn"
            value={descriptionCn}
            onChange={(e) => setDescriptionCn(e.target.value)}
            placeholder="\u4EA7\u54C1\u63CF\u8FF0..."
            rows={4}
          />
        </div>
      </div>

      {/* Material / Material CN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="ABS Plastic"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="materialCn">Material (Chinese)</Label>
          <Input
            id="materialCn"
            value={materialCn}
            onChange={(e) => setMaterialCn(e.target.value)}
            placeholder="ABS\u5851\u6599"
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-2">
        <Label htmlFor="specifications">Specifications</Label>
        <Textarea
          id="specifications"
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
          placeholder="Weight: 300g, Standard: CE EN397..."
          rows={3}
        />
      </div>

      {/* Packaging / MOQ / Unit */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="packaging">Packaging</Label>
          <Input
            id="packaging"
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
            placeholder="20pcs/carton"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moq">MOQ</Label>
          <Input
            id="moq"
            type="number"
            min={1}
            value={moq}
            onChange={(e) => setMoq(e.target.value)}
            placeholder="500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="pcs"
          />
        </div>
      </div>

      {/* Brand Name */}
      <div className="space-y-2">
        <Label htmlFor="brandName">Brand Name</Label>
        <Input
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="SafeGuard"
        />
      </div>

      {/* Category / Supplier selects */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Supplier *</Label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((sup) => (
                <SelectItem key={sup.id} value={sup.id}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Colors tag input */}
      <div className="space-y-2">
        <Label htmlFor="colorInput">Colors</Label>
        <Input
          id="colorInput"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          onKeyDown={handleColorKeyDown}
          placeholder="Type a color and press Enter"
        />
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {colors.map((color) => (
              <Badge key={color} variant="secondary">
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="ml-1 inline-flex items-center"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Sizes tag input */}
      <div className="space-y-2">
        <Label htmlFor="sizeInput">Sizes</Label>
        <Input
          id="sizeInput"
          value={sizeInput}
          onChange={(e) => setSizeInput(e.target.value)}
          onKeyDown={handleSizeKeyDown}
          placeholder="Type a size and press Enter"
        />
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sizes.map((size) => (
              <Badge key={size} variant="secondary">
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="ml-1 inline-flex items-center"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          id="isActive"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {/* Image upload section */}
      <div className="space-y-2">
        <Label>Product Images</Label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
