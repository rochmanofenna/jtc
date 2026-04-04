import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const mainImage = product.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="group/link block">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover/link:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="size-10 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-1.5">
          {/* Category label — small, uppercase, muted */}
          {product.category?.name && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.category.name}
            </p>
          )}

          {/* Product name */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Chinese name if locale is cn */}
          {locale === "cn" && product.nameCn && (
            <p className="text-xs text-muted-foreground line-clamp-1">{product.nameCn}</p>
          )}

          {/* Material badge */}
          {product.material && (
            <Badge variant="secondary" className="text-[10px] max-w-full truncate">
              {product.material}
            </Badge>
          )}

          {/* Packaging info */}
          {product.packaging && (
            <p className="text-[11px] text-muted-foreground">{product.packaging}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
