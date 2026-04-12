"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { useQuoteModal } from "@/context/quote-modal-provider";

/**
 * Sticky bottom-right button that appears after 300px of scroll on every
 * public page. Tapping it opens the global quote modal with no product
 * context (general inquiry).
 *
 * Hidden on:
 *  - Admin pages (/admin/*)
 *  - Product detail pages (they have their own dedicated sticky CTA bar)
 *  - Before 300px of scroll (lets the hero section breathe)
 */
export function FloatingQuoteButton() {
  const { open } = useQuoteModal();
  const t = useTranslations();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || isAdmin || isProductDetail) return null;

  return (
    <button
      type="button"
      onClick={() => open()}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a0f1a] font-display font-bold text-sm uppercase tracking-wide px-5 py-3.5 rounded-lg shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_30px_rgba(245,158,11,0.5)] transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in"
    >
      <MessageCircle className="size-4" />
      {t("floating.getQuote")}
    </button>
  );
}
