"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameCn: string | null;
  slug: string;
  material: string | null;
  isActive: boolean;
  category: { name: string };
  supplier: { name: string };
  images: Array<{ url: string; altText: string | null }>;
}

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      params.set("limit", "100");
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products ?? data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleToggleActive(product: Product) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(t("saved"));
    } catch {
      toast.error("Failed to update product");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(t("deleted"));
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("products")}</h1>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          render={<Link href="/admin/products/new" />}
        >
          <Plus className="size-4" />
          {t("addProduct")}
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Supplier
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Material
                </TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="size-10 overflow-hidden rounded-md bg-muted">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].altText || product.name}
                          width={40}
                          height={40}
                          className="size-10 object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center">
                          <Package className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.nameCn && (
                        <p className="text-xs text-muted-foreground">
                          {product.nameCn}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.category.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.supplier.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.material ? (
                      <Badge variant="secondary" className="text-xs">
                        {product.material}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={() => handleToggleActive(product)}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link href={`/admin/products/${product.id}/edit`} />
                        }
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete confirmation dialog */}
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
              This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;.
              This action cannot be undone.
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
