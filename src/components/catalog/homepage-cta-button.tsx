"use client";

import { useTranslations } from "next-intl";
import { useQuoteModal } from "@/context/quote-modal-provider";

/**
 * Client component wrapper for the homepage CTA banner's primary button.
 * Since the homepage is a server component, it can't call useQuoteModal()
 * directly — this small wrapper bridges the gap.
 */
export function HomepageCTAButton() {
  const t = useTranslations("cta");
  const { open } = useQuoteModal();

  return (
    <button
      type="button"
      onClick={() => open()}
      className="bg-amber-500 text-navy-950 font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-amber-400 transition-colors text-center cursor-pointer"
    >
      {t("whatsapp")}
    </button>
  );
}
