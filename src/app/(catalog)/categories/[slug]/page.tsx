import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryCard } from "@/components/catalog/category-card";
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

  // Branch on whether this category has subcategories. Categories with
  // children (e.g. PPE, Safety Helmets) render a grid of child CategoryCards
  // so the user can drill down. Leaf categories (e.g. Fiberglass Helmets,
  // Welding Equipment) render the product listing directly.
  const hasChildren = category.children.length > 0;

  // Per-child deep counts — only needed when we're rendering the card grid.
  // Each count walks the child's full subtree, so "Safety Helmets → 6" means
  // 6 products across Fiberglass/ABS/PE/Accessories leaves combined.
  const childrenWithCounts = hasChildren
    ? await Promise.all(
        category.children.map(async (child) => {
          const childIds = await getDescendantCategoryIds(child.id);
          const count = await prisma.product.count({
            where: { categoryId: { in: childIds }, isActive: true },
          });
          return { ...child, productCount: count };
        })
      )
    : [];

  // For leaf categories we fetch the product grid + paginated count.
  // For subcategory grids we skip the expensive product query entirely and
  // derive the header total by summing the already-computed child counts.
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let totalCount = 0;
  if (hasChildren) {
    totalCount = childrenWithCounts.reduce(
      (sum, c) => sum + c.productCount,
      0
    );
  } else {
    const categoryIds = await getDescendantCategoryIds(category.id);
    const [leafProducts, leafCount] = await Promise.all([
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
    products = leafProducts;
    totalCount = leafCount;
  }

  const totalPages = hasChildren
    ? 0
    : Math.ceil(totalCount / ITEMS_PER_PAGE);

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
          {hasChildren
            ? `${totalCount} ${t("common.products")} ${t("common.across")} ${childrenWithCounts.length} ${t("common.categories")}`
            : `${totalCount} ${t("common.products")} ${t("common.found")}`}
        </p>
      </div>

      {hasChildren ? (
        /* ── Subcategory card grid ────────────────────────────── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {childrenWithCounts.map((child) => (
            <CategoryCard
              key={child.id}
              category={child}
              productCount={child.productCount}
            />
          ))}
        </div>
      ) : (
        <>
          {/* ── Product grid ────────────────────────────────────── */}
          <ProductGrid products={products} />

          {/* ── Pagination ──────────────────────────────────────── */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              {pageNum > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={pageUrl(pageNum - 1)} />}
                >
                  <ChevronLeft className="size-4" />
                  {t("common.previous")}
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="size-4" />
                  {t("common.previous")}
                </Button>
              )}

              <div className="flex items-center gap-1">
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
                  {t("common.next")}
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {t("common.next")}
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
