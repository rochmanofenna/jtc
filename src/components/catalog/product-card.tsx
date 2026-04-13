"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useQuoteModal } from "@/context/quote-modal-provider";
import { ProductImageFrame } from "@/components/catalog/product-image-frame";

interface ProductCardProps {
  product: any;
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("product");
  const { open } = useQuoteModal();

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 cursor-pointer">

        {/* Standardized image frame */}
        <ProductImageFrame
          src={product.images?.[0]?.url}
          alt={product.name}
          aspectRatio="4/3"
          size="md"
          hoverScale
          className="rounded-none border-0 border-b border-gray-100"
        />

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

          {/* Supplier / brand */}
          {(product.supplier?.name || product.brandName) && (
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <p className="font-display text-[10px] font-medium uppercase tracking-wide text-gray-500">
                {product.supplier?.name || product.brandName}
              </p>
            </div>
          )}

          {/* CTA button with amber glow on card hover */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              open({ name: product.name, slug: product.slug });
            }}
            className="mt-3 w-full py-2 px-3 bg-amber-500 text-[#0a0f1a] text-xs font-display font-semibold uppercase tracking-wide rounded transition-all duration-300 group-hover:bg-amber-400 group-hover:shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
          >
            {t("getQuote")}
          </button>
        </div>
      </div>
    </Link>
  );
}
