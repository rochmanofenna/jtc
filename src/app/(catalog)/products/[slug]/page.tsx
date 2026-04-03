import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductImages } from "@/components/catalog/product-images";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  ChevronRight,
  Package,
  ShieldCheck,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  formatWhatsAppUrl,
  getWhatsAppQuoteMessage,
} from "@/lib/utils";

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

  const whatsAppUrl = formatWhatsAppUrl(
    WHATSAPP_NUMBER,
    getWhatsAppQuoteMessage(product.name, "en")
  );

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
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* ── Product detail grid ─────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-2">
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

        {/* Right: info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold lg:text-3xl">
              {product.name}
            </h1>
            {product.nameCn && (
              <p className="text-lg text-muted-foreground">{product.nameCn}</p>
            )}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Package className="mr-1 size-3" />
              {product.category.name}
            </Badge>
            {product.brandName && (
              <Badge variant="outline">{product.brandName}</Badge>
            )}
            {product.supplier.verificationStatus === "VERIFIED" && (
              <Badge className="bg-emerald-500/10 text-emerald-700">
                <ShieldCheck className="mr-1 size-3" />
                {t("product.verified")}
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
          {product.descriptionCn && (
            <p className="leading-relaxed text-muted-foreground">
              {product.descriptionCn}
            </p>
          )}

          {/* Specs card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("product.specifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {product.material && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.material")}
                    </dt>
                    <dd>{product.material}</dd>
                  </>
                )}
                {product.specifications && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.specifications")}
                    </dt>
                    <dd>{product.specifications}</dd>
                  </>
                )}
                {product.packaging && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.packaging")}
                    </dt>
                    <dd>{product.packaging}</dd>
                  </>
                )}
                {product.moq && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.moq")}
                    </dt>
                    <dd>
                      {product.moq} {product.unit || "pcs"}
                    </dd>
                  </>
                )}
                {product.colors.length > 0 && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.colors")}
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {product.colors.map((c: any) => (
                        <Badge key={c} variant="outline" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </dd>
                  </>
                )}
                {product.sizes.length > 0 && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      {t("product.sizes")}
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {product.sizes.map((s: any) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Supplier info */}
          <Card size="sm">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("product.supplier")}
                  </p>
                  <p className="font-heading font-semibold">
                    {product.supplier.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.supplier.country === "CN" ? "China" : "Indonesia"}
                  </p>
                </div>
                {product.supplier.verificationStatus === "VERIFIED" && (
                  <ShieldCheck className="size-5 text-emerald-600" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
              render={
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="size-4" />
              {t("product.requestQuote")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11"
              render={<Link href="/products" />}
            >
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Related products ────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-xl font-bold">
            {t("product.relatedProducts")}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
