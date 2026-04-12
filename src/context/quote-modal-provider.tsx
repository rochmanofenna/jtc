"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { QuoteInquiryModal } from "@/components/catalog/quote-inquiry-modal";

interface QuoteModalProduct {
  name: string;
  slug: string;
}

interface QuoteModalContextValue {
  open: (product?: QuoteModalProduct) => void;
  close: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) {
    throw new Error("useQuoteModal must be used within a QuoteModalProvider");
  }
  return ctx;
}

/**
 * Provides a global quote-inquiry modal that any component in the tree can
 * trigger via `useQuoteModal().open()`. The modal is rendered exactly once
 * here — individual pages/components no longer mount their own instances.
 *
 * Optionally pass a product to pre-fill the modal:
 *   open({ name: "Safety Helmet", slug: "safety-helmet-v1" })
 */
export function QuoteModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<QuoteModalProduct | undefined>();

  const open = useCallback((p?: QuoteModalProduct) => {
    setProduct(p);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Don't clear product immediately — let the close animation finish.
    setTimeout(() => setProduct(undefined), 200);
  }, []);

  return (
    <QuoteModalContext.Provider value={{ open, close }}>
      {children}
      <QuoteInquiryModal
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        productName={product?.name}
        productSlug={product?.slug}
      />
    </QuoteModalContext.Provider>
  );
}
