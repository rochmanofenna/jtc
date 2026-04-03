import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const mainImage = product.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="group/link block">
      <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
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

        <CardContent className="space-y-1.5">
          {/* Product name */}
          <h3 className="line-clamp-2 font-medium leading-snug">
            {product.name}
          </h3>

          {/* Chinese name */}
          {locale === "cn" && product.nameCn && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {product.nameCn}
            </p>
          )}

          {/* Material badge */}
          {product.material && (
            <Badge variant="secondary" className="text-xs">
              {product.material}
            </Badge>
          )}

          {/* Brand */}
          {product.brandName && (
            <Badge variant="outline" className="text-xs">
              {product.brandName}
            </Badge>
          )}

          {/* Packaging */}
          {product.packaging && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {product.packaging}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
