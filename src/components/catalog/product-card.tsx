"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useQuoteModal } from "@/context/quote-modal-provider";

interface ProductCardProps {
  product: any;
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("product");
  const { open } = useQuoteModal();

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">

        {/* Image area — 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Category label */}
          {product.category?.name && (
            <p className="font-display text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1.5">
              {product.category.name}
            </p>
          )}

          {/* Product name */}
          <h3 className="font-display text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Chinese name if locale is cn */}
          {locale === "cn" && product.nameCn && (
            <p className="font-body text-xs text-gray-400 line-clamp-1 mb-2">
              {product.nameCn}
            </p>
          )}

          {/* Specs line: material + packaging */}
          {(product.material || product.packaging) && (
            <p className="font-body text-xs text-gray-400 line-clamp-1">
              {[product.material, product.packaging].filter(Boolean).join(" \u00b7 ")}
            </p>
          )}

          {/* Supplier / brand — separated by thin border */}
          {(product.supplier?.name || product.brandName) && (
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <p className="font-display text-[10px] font-medium uppercase tracking-wide text-gray-500">
                {product.supplier?.name || product.brandName}
              </p>
            </div>
          )}

          {/* CTA button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              open({ name: product.name, slug: product.slug });
            }}
            className="mt-3 w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f1a] text-xs font-display font-semibold uppercase tracking-wide rounded transition-colors duration-200"
          >
            {t("getQuote")}
          </button>
        </div>
      </div>
    </Link>
  );
}
