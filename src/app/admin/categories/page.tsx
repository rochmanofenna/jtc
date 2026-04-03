"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  Loader2,
  FolderTree,
} from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  nameCn: string | null;
  slug: string;
  icon: string | null;
  sortOrder: number;
  parentId: string | null;
  _count?: { products: number };
  children?: Category[];
}

interface CategoryFormData {
  name: string;
  nameCn: string;
  slug: string;
  icon: string;
  sortOrder: number;
  parentId: string | null;
}

const emptyForm: CategoryFormData = {
  name: "",
  nameCn: "",
  slug: "",
  icon: "",
  sortOrder: 0,
  parentId: "",
};

export default function AdminCategoriesPage() {
  const t = useTranslations("admin");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Build tree from flat list
  const rootCategories = categories.filter((c) => !c.parentId);
  const childMap = new Map<string, Category[]>();
  for (const cat of categories) {
    if (cat.parentId) {
      const existing = childMap.get(cat.parentId) || [];
      existing.push(cat);
      childMap.set(cat.parentId, existing);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      nameCn: cat.nameCn || "",
      slug: cat.slug,
      icon: cat.icon || "",
      sortOrder: cat.sortOrder,
      parentId: cat.parentId || "",
    });
    setDialogOpen(true);
  }

  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        nameCn: formData.nameCn || undefined,
        slug: formData.slug,
        icon: formData.icon || undefined,
        sortOrder: formData.sortOrder,
        parentId: formData.parentId || undefined,
      };

      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setDialogOpen(false);
      toast.success(t("saved"));
      fetchCategories();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteTarget(null);
      toast.success(t("deleted"));
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("categories")}</h1>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          {t("addCategory")}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : rootCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderTree className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {rootCategories.map((parent) => {
            const children = childMap.get(parent.id) || [];
            return (
              <div key={parent.id}>
                {/* Parent row */}
                <div className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FolderTree className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{parent.name}</p>
                      {parent.nameCn && (
                        <p className="text-xs text-muted-foreground">
                          {parent.nameCn}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {parent._count?.products ?? 0} products
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(parent)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(parent)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Children rows */}
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between rounded-lg py-2.5 pl-12 pr-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{child.name}</p>
                        {child.nameCn && (
                          <p className="text-xs text-muted-foreground">
                            {child.nameCn}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {child._count?.products ?? 0}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(child)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(child)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create/Edit dialog ──────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : t("addCategory")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-nameCn">Chinese Name</Label>
              <Input
                id="cat-nameCn"
                value={formData.nameCn}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, nameCn: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-icon">Icon</Label>
              <Input
                id="cat-icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, icon: e.target.value }))
                }
                placeholder="e.g. HardHat"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-sortOrder">Sort Order</Label>
                <Input
                  id="cat-sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, parentId: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (top-level)</SelectItem>
                    {rootCategories
                      .filter((c) => c.id !== editingId)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ─────────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;
              and may affect child categories and products.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
