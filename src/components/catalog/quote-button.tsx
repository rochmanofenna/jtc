"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useQuoteModal } from "@/context/quote-modal-provider";

interface QuoteButtonProps {
  productName?: string;
  productSlug?: string;
  className?: string;
  /** Override the button label (defaults to product.requestQuote i18n key). */
  label?: string;
}

/**
 * CTA button that opens the global quote modal. No longer renders its own
 * modal instance — the single global QuoteInquiryModal lives in the
 * QuoteModalProvider at the root layout level.
 */
export function QuoteButton({
  productName,
  productSlug,
  className,
  label,
}: QuoteButtonProps) {
  const t = useTranslations("product");
  const { open } = useQuoteModal();

  return (
    <button
      type="button"
      onClick={() =>
        open(
          productName && productSlug
            ? { name: productName, slug: productSlug }
            : undefined
        )
      }
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "h-12 px-8 rounded-sm",
        "bg-amber-500 text-[#0a0f1a] hover:bg-amber-400",
        "font-display text-sm font-semibold uppercase tracking-wide",
        "transition-colors cursor-pointer",
        "w-full sm:w-auto",
        className
      )}
    >
      <MessageCircle className="size-4" />
      {label ?? t("requestQuote")}
    </button>
  );
}
