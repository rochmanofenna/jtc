"use client";

import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductImages } from "@/components/catalog/product-images";
import { QuoteButton } from "@/components/catalog/quote-button";

interface ProductDetailProps {
  product: any;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations("product");

  const specs = [
    { label: t("material"), value: product.material },
    { label: t("specifications"), value: product.specifications },
    { label: t("packaging"), value: product.packaging },
    { label: t("moq"), value: product.moq },
    { label: t("unit"), value: product.unit },
  ].filter((s) => s.value);

  const colors: string[] = product.colors ?? [];
  const sizes: string[] = product.sizes ?? [];

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Images */}
        <div className="lg:col-span-3">
          <ProductImages
            images={product.images ?? []}
            productName={product.name}
          />
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Name */}
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight">
              {product.name}
            </h1>
            {product.nameCn && (
              <p className="mt-1 text-sm text-muted-foreground">
                {product.nameCn}
              </p>
            )}
          </div>

          {/* Brand */}
          {product.brandName && (
            <Badge variant="secondary">{t("brand")}: {product.brandName}</Badge>
          )}

          {/* Specs table */}
          {specs.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i > 0 ? "border-t" : ""}>
                      <td className="bg-muted/50 px-3 py-2 font-medium text-muted-foreground">
                        {spec.label}
                      </td>
                      <td className="px-3 py-2">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("colors")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color) => (
                  <Badge key={color} variant="secondary">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("sizes")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Supplier */}
          {product.supplier && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("supplier")}:</span>
              <span className="font-medium">{product.supplier.name}</span>
              {product.supplier.verified && (
                <span className="inline-flex items-center gap-1 text-accent">
                  <Shield className="size-3.5" />
                  <span className="text-xs font-medium">{t("verified")}</span>
                </span>
              )}
            </div>
          )}

          {/* Desktop quote button */}
          <div className="hidden lg:block">
            <QuoteButton productName={product.name} className="w-full" />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background p-3 lg:hidden">
        <QuoteButton productName={product.name} className="w-full" />
      </div>
    </div>
  );
}
