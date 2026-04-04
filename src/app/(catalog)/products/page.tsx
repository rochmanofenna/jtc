import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { search, category } = await searchParams;
  const searchStr = typeof search === "string" ? search : undefined;
  const categoryStr = typeof category === "string" ? category : undefined;

  let title = "Products | Jakarta Trade Connect";
  if (searchStr) {
    title = `Search: ${searchStr} | Jakarta Trade Connect`;
  } else if (categoryStr) {
    const cat = await prisma.category.findUnique({
      where: { slug: categoryStr },
    });
    if (cat) {
      title = `${cat.name} | Jakarta Trade Connect`;
    }
  }

  return {
    title,
    description:
      "Browse industrial safety equipment, tools, and construction materials from verified Chinese suppliers.",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;
  const pageNum = Math.max(
    1,
    typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1
  );

  const t = await getTranslations();

  // Fetch all top-level categories with children for subcategory-inclusive counts
  const categoriesRaw = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { select: { id: true } } },
    orderBy: { sortOrder: "asc" },
  });

  const categories = await Promise.all(
    categoriesRaw.map(async (cat) => {
      const ids = [cat.id, ...cat.children.map((c: any) => c.id)];
      const count = await prisma.product.count({
        where: { categoryId: { in: ids }, isActive: true },
      });
      return { ...cat, productCount: count };
    })
  );

  // Resolve category for filtering (include subcategories)
  let activeCategoryName: string | undefined;
  if (categorySlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (cat) {
      activeCategoryName = cat.name;
    }
  }

  // Build product query
  const where: any = { isActive: true };
  if (categorySlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: { select: { id: true } } },
    });
    if (cat) {
      const ids = [cat.id, ...cat.children.map((c: any) => c.id)];
      where.categoryId = { in: ids };
    }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameCn: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { material: { contains: search, mode: "insensitive" } },
      { brandName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { sortOrder: "asc" },
      skip: (pageNum - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Helper to build URL with filters
  function buildUrl(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {};
    if (search) base.search = search;
    if (categorySlug) base.category = categorySlug;
    // Remove any keys with undefined values (clear filter)
    const merged = { ...base, ...overrides };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined)
    );
    const qs = new URLSearchParams(cleaned as Record<string, string>).toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  const hasActiveFilters = !!(search || categorySlug);

  return (
    <div className="container-wide py-8">
      {/* Page header */}
      <div className="mb-6 space-y-2">
        <h1 className="font-heading text-2xl font-bold lg:text-3xl">
          {search
            ? `"${search}"`
            : activeCategoryName
              ? activeCategoryName
              : t("nav.products")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1.5">
              Search: {search}
              <Link href={buildUrl({ search: undefined, page: undefined })}>
                <X className="size-3" />
              </Link>
            </Badge>
          )}
          {activeCategoryName && (
            <Badge variant="secondary" className="gap-1.5">
              {activeCategoryName}
              <Link href={buildUrl({ category: undefined, page: undefined })}>
                <X className="size-3" />
              </Link>
            </Badge>
          )}
          <Link
            href="/products"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("filter.clearAll")}
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar (desktop) / Pill nav (mobile) ──────────────── */}
        <aside className="shrink-0 lg:w-64">
          {/* Mobile: horizontal pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden">
            <Link
              href={buildUrl({ category: undefined, page: undefined })}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !categorySlug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("common.all")}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={buildUrl({ category: cat.slug, page: undefined })}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Desktop: vertical sidebar */}
          <div className="hidden space-y-6 lg:block">
            {/* Category filter */}
            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold">
                {t("filter.category")}
              </h3>
              <nav className="flex flex-col gap-0.5">
                <Link
                  href={buildUrl({ category: undefined, page: undefined })}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    !categorySlug
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t("common.all")}
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={buildUrl({ category: cat.slug, page: undefined })}
                    className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                      categorySlug === cat.slug
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.productCount}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ── Product grid ───────────────────────────────────────── */}
        <div className="flex-1">
          <ProductGrid products={products} />

          {/* ── Pagination ────────────────────────────────────────── */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              {pageNum > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link
                      href={buildUrl({
                        page: String(pageNum - 1),
                      })}
                    />
                  }
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
                    // Show first, last, and pages near current
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - pageNum) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const elements = [];
                    // Add ellipsis if gap between consecutive rendered pages
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
                        href={buildUrl({ page: String(p) })}
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
                  render={
                    <Link
                      href={buildUrl({
                        page: String(pageNum + 1),
                      })}
                    />
                  }
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
      </div>
    </div>
  );
}
