import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDescendantCategoryIds } from "@/lib/category-tree";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: `Browse ${category.name} products — industrial safety equipment from verified Chinese suppliers.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const pageNum = Math.max(
    1,
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page, 10) || 1
      : 1
  );

  const t = await getTranslations();

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
      },
      parent: { select: { name: true, slug: true } },
    },
  });

  if (!category) {
    notFound();
  }

  // Walk the FULL descendant tree so super-categories (PPE, Construction
  // Tools, Electric Supply) aggregate every product underneath them, not
  // just the products directly attached one level down.
  const categoryIds = await getDescendantCategoryIds(category.id);

  // For the subcategory pills, count each child's own deep descendant total
  // so the badge reflects "products visible after clicking this subcategory".
  const childrenWithCounts = await Promise.all(
    category.children.map(async (child) => {
      const childIds = await getDescendantCategoryIds(child.id);
      const count = await prisma.product.count({
        where: { categoryId: { in: childIds }, isActive: true },
      });
      return { ...child, productCount: count };
    })
  );

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: { in: categoryIds },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { sortOrder: "asc" },
      skip: (pageNum - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({
      where: {
        isActive: true,
        categoryId: { in: categoryIds },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  function pageUrl(page: number) {
    return `/categories/${slug}${page > 1 ? `?page=${page}` : ""}`;
  }

  return (
    <div className="container-wide py-8">
      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          {t("nav.home")}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground">
          {t("nav.products")}
        </Link>
        <ChevronRight className="size-3.5" />
        {category.parent && (
          <>
            <Link
              href={`/categories/${category.parent.slug}`}
              className="hover:text-foreground"
            >
              {category.parent.name}
            </Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* ── Category header ─────────────────────────────────────── */}
      <div className="mb-8 space-y-3">
        <h1 className="font-heading text-2xl font-bold lg:text-3xl">
          {category.name}
        </h1>
        {category.nameCn && (
          <p className="text-muted-foreground">{category.nameCn}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* ── Subcategory pills ───────────────────────────────────── */}
      {childrenWithCounts.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {childrenWithCounts.map((child) => (
            <Link key={child.id} href={`/categories/${child.slug}`}>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm hover:bg-secondary/80"
              >
                {child.name}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({child.productCount})
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* ── Product grid ────────────────────────────────────────── */}
      <ProductGrid products={products} />

      {/* ── Pagination ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          {pageNum > 1 ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={pageUrl(pageNum - 1)} />}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 || p === totalPages || Math.abs(p - pageNum) <= 1
                );
              })
              .map((p, idx, arr) => {
                const elements = [];
                if (idx > 0 && p - arr[idx - 1] > 1) {
                  elements.push(
                    <span
                      key={`ellipsis-${p}`}
                      className="px-1 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
                elements.push(
                  <Link
                    key={p}
                    href={pageUrl(p)}
                    className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                      p === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {p}
                  </Link>
                );
                return elements;
              })}
          </div>

          {pageNum < totalPages ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={pageUrl(pageNum + 1)} />}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
