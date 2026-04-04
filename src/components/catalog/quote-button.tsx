"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import { cn, formatWhatsAppUrl, getWhatsAppQuoteMessage } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface QuoteButtonProps {
  productName: string;
  className?: string;
}

export function QuoteButton({ productName, className }: QuoteButtonProps) {
  const t = useTranslations("product");
  const locale = useLocale();

  function handleClick() {
    const message = getWhatsAppQuoteMessage(productName, locale);
    const url = formatWhatsAppUrl(WHATSAPP_NUMBER, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
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
  );
}
