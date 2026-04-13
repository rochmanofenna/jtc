"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuoteModal } from "@/context/quote-modal-provider";
import { ProductImageFrame } from "@/components/catalog/product-image-frame";
import { getCategoryLabelColor } from "@/lib/category-colors";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string } | null;
  supplier: { name: string } | null;
  imageUrl: string | null;
}

interface FeaturedCarouselProps {
  products: FeaturedProduct[];
}

/**
 * Horizontal scroll-snap carousel of featured products for the homepage.
 * Uses native CSS scroll-snap — no heavy carousel dependencies.
 * 4 visible on desktop, 1.5 on mobile (peeks next card).
 */
export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const t = useTranslations();
  const { open } = useQuoteModal();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth
      : 300;
    const amount = direction === "left" ? -cardWidth - 20 : cardWidth + 20;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-wide">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-amber-500">
              {t("featured.label")}
            </span>
            <div className="w-10 h-0.5 bg-amber-500 mt-2 mb-3" />
            <p className="font-body text-sm text-gray-500">
              {t("featured.subtitle")}
            </p>
          </div>

          {/* Desktop arrows — frosted glass style */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex items-center justify-center size-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-500 hover:bg-white hover:shadow-xl hover:text-amber-600 transition-all duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex items-center justify-center size-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-500 hover:bg-white hover:shadow-xl hover:text-amber-600 transition-all duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable track with edge-fade masks */}
        <div className="relative">
          {/* Left/right gradient masks for smooth edge fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 z-10 bg-gradient-to-r from-white to-transparent hidden sm:block" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 z-10 bg-gradient-to-l from-white to-transparent hidden sm:block" />

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none" }}
          >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 snap-start w-[calc(75%-8px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
            >
              <div className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 h-full flex flex-col">
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="block">
                  <ProductImageFrame
                    src={product.imageUrl}
                    alt={product.name}
                    aspectRatio="3/2"
                    size="md"
                    hoverScale
                    className="rounded-none border-0 border-b border-gray-100"
                  />
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {product.category && (
                    <p className={`font-display text-[10px] font-semibold uppercase tracking-wide mb-1.5 ${getCategoryLabelColor(product.category.slug)}`}>
                      {product.category.name}
                    </p>
                  )}
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-display text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2 hover:text-amber-600 transition-colors"
                  >
                    {product.name}
                  </Link>

                  {product.supplier && (
                    <p className="font-display text-[10px] font-medium uppercase tracking-wide text-gray-500 mt-auto pt-2 border-t border-gray-100">
                      {product.supplier.name}
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() =>
                      open({ name: product.name, slug: product.slug })
                    }
                    className="mt-3 w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f1a] text-xs font-display font-semibold uppercase tracking-wide rounded transition-colors duration-200"
                  >
                    {t("product.getQuote")}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
