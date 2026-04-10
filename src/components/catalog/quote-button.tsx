"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { QuoteInquiryModal } from "@/components/catalog/quote-inquiry-modal";

interface QuoteButtonProps {
  productName?: string;
  productSlug?: string;
  className?: string;
}

export function QuoteButton({
  productName,
  productSlug,
  className,
}: QuoteButtonProps) {
  const t = useTranslations("product");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
        {t("requestQuote")}
      </button>

      <QuoteInquiryModal
        open={open}
        onOpenChange={setOpen}
        productName={productName}
        productSlug={productSlug}
      />
    </>
  );
}
