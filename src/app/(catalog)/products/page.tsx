import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { ProductGrid } from "@/components/catalog/product-grid";
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
        supplier: { select: { name: true } },
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
    <div className="container-wide py-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8 space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-gray-900 lg:text-3xl">
          {search
            ? `\u201c${search}\u201d`
            : activeCategoryName
              ? activeCategoryName
              : t("nav.products")}
        </h1>
        <p className="font-body text-sm text-gray-500">
          {totalCount} {totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {search && (
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-gray-100 px-2.5 py-1 font-body text-xs text-gray-600">
              Search: {search}
              <Link
                href={buildUrl({ search: undefined, page: undefined })}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}
          {activeCategoryName && (
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-gray-100 px-2.5 py-1 font-body text-xs text-gray-600">
              {activeCategoryName}
              <Link
                href={buildUrl({ category: undefined, page: undefined })}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}
          <Link
            href="/products"
            className="font-body text-xs text-gray-400 underline-offset-4 hover:underline hover:text-gray-900 transition-colors"
          >
            {t("filter.clearAll")}
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar (desktop) / Pill nav (mobile) */}
        <aside className="shrink-0 lg:w-56">
          {/* Mobile: horizontal pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden">
            <Link
              href={buildUrl({ category: undefined, page: undefined })}
              className={`shrink-0 rounded-sm px-3 py-1.5 font-display text-xs uppercase tracking-wide transition-colors ${
                !categorySlug
                  ? "bg-navy-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("common.all")}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={buildUrl({ category: cat.slug, page: undefined })}
                className={`shrink-0 rounded-sm px-3 py-1.5 font-display text-xs uppercase tracking-wide transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-navy-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Desktop: vertical sidebar */}
          <div className="hidden lg:block">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
              {t("filter.category")}
            </h3>
            <nav className="flex flex-col">
              <Link
                href={buildUrl({ category: undefined, page: undefined })}
                className={`font-body text-sm py-1.5 transition-colors ${
                  !categorySlug
                    ? "text-gray-900 font-medium border-l-2 border-amber-500 pl-3"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("common.all")}
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug, page: undefined })}
                  className={`flex items-center justify-between py-1.5 transition-colors ${
                    categorySlug === cat.slug
                      ? "text-gray-900 font-medium border-l-2 border-amber-500 pl-3"
                      : "font-body text-sm text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="font-body text-sm">{cat.name}</span>
                  <span className="font-mono text-xs text-gray-400">
                    {cat.productCount}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1">
              {/* Previous */}
              {pageNum > 1 ? (
                <Link
                  href={buildUrl({ page: String(pageNum - 1) })}
                  className="inline-flex items-center gap-1 px-3 py-2 font-display text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 font-display text-sm text-gray-300 cursor-not-allowed">
                  <ChevronLeft className="size-4" />
                  Previous
                </span>
              )}

              {/* Page numbers */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - pageNum) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const elements = [];
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      elements.push(
                        <span
                          key={`ellipsis-${p}`}
                          className="px-1 font-display text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    elements.push(
                      <Link
                        key={p}
                        href={buildUrl({ page: String(p) })}
                        className={`flex size-8 items-center justify-center font-display text-sm transition-colors ${
                          p === pageNum
                            ? "bg-navy-900 text-white rounded-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                    return elements;
                  })}
              </div>

              {/* Next */}
              {pageNum < totalPages ? (
                <Link
                  href={buildUrl({ page: String(pageNum + 1) })}
                  className="inline-flex items-center gap-1 px-3 py-2 font-display text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 font-display text-sm text-gray-300 cursor-not-allowed">
                  Next
                  <ChevronRight className="size-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
