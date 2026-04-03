"use client";

import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn, formatWhatsAppUrl, getWhatsAppQuoteMessage } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface QuoteButtonProps {
  productName: string;
  className?: string;
}

export function QuoteButton({ productName, className }: QuoteButtonProps) {
  const t = useTranslations("product");
  const locale = useLocale();
  const hasAnimated = useRef(false);

  function handleClick() {
    const message = getWhatsAppQuoteMessage(productName, locale);
    const url = formatWhatsAppUrl(WHATSAPP_NUMBER, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={!hasAnimated.current ? { scale: 1 } : false}
      animate={
        !hasAnimated.current
          ? {
              scale: [1, 1.04, 1],
              transition: { duration: 0.6, delay: 0.5 },
            }
          : {}
      }
      onAnimationComplete={() => {
        hasAnimated.current = true;
      }}
    >
      <Button
        size="lg"
        className={cn(
          "bg-accent text-accent-foreground hover:bg-accent/90",
          className
        )}
        onClick={handleClick}
      >
        <MessageCircle className="size-4" />
        {t("requestQuote")}
      </Button>
    </motion.div>
  );
}
