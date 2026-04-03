"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Building,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  country: string;
  city: string | null;
  industry: string | null;
  verificationStatus: string;
  logoUrl: string | null;
  _count?: { products: number };
}

export default function AdminSuppliersPage() {
  const t = useTranslations("admin");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSuppliers(data);
    } catch {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/suppliers/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSuppliers((prev) =>
        prev.filter((s) => s.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
      toast.success(t("deleted"));
    } catch {
      toast.error("Failed to delete supplier");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = searchQuery
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suppliers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("suppliers")}</h1>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          render={<Link href="/admin/suppliers/new" />}
        >
          <Plus className="size-4" />
          {t("addSupplier")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers..."
          className="pl-9"
        />
      </div>

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
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Industry
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Products
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {supplier.logoUrl ? (
                        <Image
                          src={supplier.logoUrl}
                          alt={supplier.name}
                          width={32}
                          height={32}
                          className="size-8 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                          <Building className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{supplier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {supplier.country === "CN" ? "China" : "Indonesia"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {supplier.industry || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {supplier._count?.products ?? 0}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {supplier.verificationStatus === "VERIFIED" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700">
                        <ShieldCheck className="mr-1 size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {supplier.verificationStatus}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          // Navigate to edit — for now re-use new page with query
                          window.location.href = `/admin/suppliers/new?edit=${supplier.id}`;
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(supplier)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete confirmation */}
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
              Products from this supplier will be affected.
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
