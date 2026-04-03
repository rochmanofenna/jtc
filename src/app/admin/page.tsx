import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Package,
  FolderTree,
  Building,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");

  const [productCount, categoryCount, supplierCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.company.count({ where: { type: "supplier" } }),
      prisma.product.findMany({
        include: {
          category: { select: { name: true } },
          supplier: { select: { name: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
    ]);

  const stats = [
    {
      label: t("totalProducts"),
      value: productCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: t("totalCategories"),
      value: categoryCount,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      label: t("totalSuppliers"),
      value: supplierCount,
      icon: Building,
      href: "/admin/suppliers",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("dashboard")}</h1>
      </div>

      {/* ── Stats cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-heading text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* ── Quick actions ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          render={<Link href="/admin/products/new" />}
        >
          <Plus className="size-4" />
          {t("addProduct")}
        </Button>
        <Button variant="outline" render={<Link href="/admin/categories" />}>
          <Plus className="size-4" />
          {t("addCategory")}
        </Button>
        <Button variant="outline" render={<Link href="/admin/suppliers/new" />}>
          <Plus className="size-4" />
          {t("addSupplier")}
        </Button>
      </div>

      {/* ── Recent products table ───────────────────────────────── */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Products</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/admin/products" />}
          >
            View all
            <ArrowRight className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Supplier
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProducts.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.category.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.supplier.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                    >
                      {product.isActive ? t("active") : t("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {product.updatedAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {recentProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
