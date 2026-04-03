"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SupplierFormProps {
  initialData?: any
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name ?? "")
  const [country, setCountry] = useState(initialData?.country ?? "CN")
  const [city, setCity] = useState(initialData?.city ?? "")
  const [address, setAddress] = useState(initialData?.address ?? "")
  const [industry, setIndustry] = useState(initialData?.industry ?? "")
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  )
  const [website, setWebsite] = useState(initialData?.website ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const body: Record<string, unknown> = {
      name,
      country,
      city: city || undefined,
      address: address || undefined,
      industry: industry || undefined,
      description: description || undefined,
      website: website || undefined,
    }

    try {
      const url = isEdit
        ? `/api/suppliers/${initialData.id}`
        : "/api/suppliers"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to save supplier")
      }

      toast.success(isEdit ? "Supplier updated" : "Supplier created")
      router.push("/admin/suppliers")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Guangzhou Safety Equipment Co."
          required
        />
      </div>

      {/* Country / City */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Country *</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CN">China (CN)</SelectItem>
              <SelectItem value="ID">Indonesia (ID)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Guangzhou"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full address..."
          rows={3}
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Safety Equipment"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="About the company..."
          rows={4}
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Supplier"
              : "Save Supplier"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/suppliers")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
