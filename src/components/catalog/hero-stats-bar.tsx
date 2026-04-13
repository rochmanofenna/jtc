"use client";

import { AnimatedNumber } from "@/components/catalog/animated-number";

interface HeroStatsBarProps {
  totalProducts: number;
  totalCategories: number;
}

/**
 * Animated stats bar for the hero section. Numbers count up on mount
 * with staggered delays for a cascading reveal effect.
 */
export function HeroStatsBar({
  totalProducts,
  totalCategories,
}: HeroStatsBarProps) {
  return (
    <div className="flex gap-6 sm:gap-8 items-center flex-wrap">
      <span className="font-mono text-sm text-gray-500">
        <AnimatedNumber
          value={totalProducts}
          suffix="+"
          className="text-amber-400 font-bold tabular-nums"
          duration={1800}
        />{" "}
        Products
      </span>
      <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
      <span className="font-mono text-sm text-gray-500">
        <AnimatedNumber
          value={totalCategories}
          className="text-white font-bold tabular-nums"
          duration={1200}
        />{" "}
        Categories
      </span>
      <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
      <span className="font-mono text-sm text-gray-500">
        <span className="text-white font-bold">3</span> Verified Suppliers
      </span>
    </div>
  );
}
