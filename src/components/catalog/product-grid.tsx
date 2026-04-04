import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  locale?: string;
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 w-16 rounded-sm bg-gray-100 animate-pulse" />
        <div className="h-4 w-3/4 rounded-sm bg-gray-100 animate-pulse" />
        <div className="h-3 w-1/2 rounded-sm bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading, locale }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
