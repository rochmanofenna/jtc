import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductImages } from "@/components/catalog/product-images";
import { ProductGrid } from "@/components/catalog/product-grid";
import { QuoteButton } from "@/components/catalog/quote-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: { select: { name: true } },
    },
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — available from Jakarta Trade Connect`,
    openGraph: {
      title: product.name,
      description:
        product.description ||
        `${product.name} — ${product.category.name}`,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.name }]
        : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, name: true, slug: true } },
      supplier: {
        select: {
          name: true,
          country: true,
          verificationStatus: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.category.id,
      isActive: true,
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  // Build specs list
  const specs: Array<{ label: string; value: string }> = [];
  if (product.material)
    specs.push({ label: t("product.material"), value: product.material });
  if (product.specifications)
    specs.push({
      label: t("product.specifications"),
      value: product.specifications,
    });
  if (product.packaging)
    specs.push({ label: t("product.packaging"), value: product.packaging });
  if (product.moq)
    specs.push({
      label: t("product.moq"),
      value: `${product.moq} ${product.unit || "pcs"}`,
    });
  if (product.unit)
    specs.push({ label: t("product.unit"), value: product.unit });
  if (product.brandName)
    specs.push({ label: t("product.brand"), value: product.brandName });

  const colors: string[] = product.colors ?? [];
  const sizes: string[] = product.sizes ?? [];

  return (
    <div className="container-wide py-8">
      {/* Back link */}
      <nav className="mb-8">
        <Link
          href={`/categories/${product.category.slug}`}
          className="font-body text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          &larr; Back to {product.category.name}
        </Link>
      </nav>

      {/* Two-column product layout */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: images */}
        <div>
          <ProductImages
            images={product.images.map((img: any) => ({
              url: img.url,
              altText: img.altText ?? undefined,
            }))}
            productName={product.name}
          />
        </div>

        {/* Right: details */}
        <div>
          {/* Category label */}
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600 mb-2">
            {product.category.name}
          </p>

          {/* Product name */}
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Chinese name */}
          {product.nameCn && (
            <p className="font-body text-lg text-gray-400 mt-1">
              {product.nameCn}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p className="font-body text-sm text-gray-500 leading-relaxed mt-4">
              {product.description}
            </p>
          )}
          {product.descriptionCn && (
            <p className="font-body text-sm text-gray-400 leading-relaxed mt-2">
              {product.descriptionCn}
            </p>
          )}

          {/* Separator */}
          <div className="w-10 h-0.5 bg-amber-500 my-6" />

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
                {t("product.specifications")}
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="font-body text-sm font-medium text-gray-500 w-32 py-2.5 px-3">
                        {spec.label}
                      </td>
                      <td className="font-body text-sm text-gray-900 py-2.5 px-3">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
                {t("product.colors")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color: string) => (
                  <span
                    key={color}
                    className="rounded-sm bg-gray-100 text-gray-700 text-xs px-2 py-1 font-body"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
                {t("product.sizes")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((size: string) => (
                  <span
                    key={size}
                    className="rounded-sm bg-gray-100 text-gray-700 text-xs px-2 py-1 font-body"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Supplier info */}
          <div className="mb-8">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              {t("product.supplier")}
            </p>
            <p className="font-body text-sm text-gray-900 mt-1">
              {product.supplier.name}
              {product.supplier.country && (
                <span className="text-gray-400 ml-1.5">
                  {product.supplier.country === "CN" ? "China" : "Indonesia"}
                </span>
              )}
            </p>
          </div>

          {/* CTA - desktop inline, mobile full width */}
          <div className="hidden sm:block">
            <QuoteButton productName={product.name} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 p-4 sm:hidden">
        <QuoteButton productName={product.name} className="w-full" />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-200 mt-16 pt-12">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-6">
            {t("product.relatedProducts")}
          </p>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
