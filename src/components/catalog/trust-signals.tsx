"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

interface TrustSignalsProps {
  variant?: "light" | "dark";
}

/**
 * Three trust bullets shown near CTAs to reduce hesitation:
 *   ✓ Response within 24 hours
 *   ✓ Direct from verified suppliers
 *   ✓ Free quotation, no obligation
 */
export function TrustSignals({ variant = "light" }: TrustSignalsProps) {
  const t = useTranslations("trust");

  const textColor = variant === "dark" ? "text-gray-400" : "text-gray-500";
  const checkColor = variant === "dark" ? "text-green-400" : "text-green-600";

  const signals = [
    t("fastResponse"),
    t("verifiedSuppliers"),
    t("freeQuote"),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
      {signals.map((signal) => (
        <div key={signal} className="flex items-center gap-1.5">
          <Check className={`size-3.5 shrink-0 ${checkColor}`} />
          <span className={`text-xs font-body ${textColor}`}>{signal}</span>
        </div>
      ))}
    </div>
  );
}
