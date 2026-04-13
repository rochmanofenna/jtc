"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/catalog/product-card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  locale?: string;
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-[4/3] w-full bg-gray-50 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 w-16 rounded-sm bg-gray-100 animate-pulse" />
        <div className="h-4 w-3/4 rounded-sm bg-gray-100 animate-pulse" />
        <div className="h-3 w-1/2 rounded-sm bg-gray-100 animate-pulse" />
        <div className="h-9 w-full rounded bg-gray-100 animate-pulse mt-3" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading, locale }: ProductGridProps) {
  const t = useTranslations("common");
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX className="mb-4 size-12 text-gray-400/40" />
        <p className="font-display text-lg font-medium text-gray-500">
          {t("noProductsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product, i) =>
        i < 12 ? (
          <AnimateOnScroll
            key={product.id}
            delay={Math.min(i * 50, 600)}
            animation="fadeUp"
          >
            <ProductCard product={product} locale={locale} />
          </AnimateOnScroll>
        ) : (
          <ProductCard key={product.id} product={product} locale={locale} />
        )
      )}
    </div>
  );
}
