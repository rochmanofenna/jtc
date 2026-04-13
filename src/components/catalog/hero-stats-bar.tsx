"use client";

import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/catalog/animated-number";

interface HeroStatsBarProps {
  totalProducts: number;
  totalCategories: number;
}

export function HeroStatsBar({
  totalProducts,
  totalCategories,
}: HeroStatsBarProps) {
  const t = useTranslations("common");

  return (
    <div className="flex gap-6 sm:gap-8 items-center flex-wrap">
      <span className="font-mono text-sm text-gray-500">
        <AnimatedNumber
          value={totalProducts}
          suffix="+"
          className="text-amber-400 font-bold tabular-nums"
          duration={1800}
        />{" "}
        {t("products")}
      </span>
      <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
      <span className="font-mono text-sm text-gray-500">
        <AnimatedNumber
          value={totalCategories}
          className="text-white font-bold tabular-nums"
          duration={1200}
        />{" "}
        {t("categories")}
      </span>
      <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
      <span className="font-mono text-sm text-gray-500">
        <span className="text-white font-bold">3</span> {t("verifiedSuppliers")}
      </span>
    </div>
  );
}
