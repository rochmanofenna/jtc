"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { CategoryMenuItem } from "@/lib/category-menu";

interface ProductsSidebarProps {
  categoryMenu: CategoryMenuItem[];
  activeSlug?: string;
  /** Current `?search=` value — preserved when changing the category filter. */
  search?: string;
}

/**
 * Expandable category sidebar for the products listing page.
 *
 * Each super-category is a clickable filter link AND has a chevron toggle
 * that reveals its mid-level subcategories inline. Tapping PPE filters to
 * all 69 PPE products; tapping the chevron shows Safety Helmets / Gloves /
 * etc. underneath so users can narrow further without navigating first to
 * the category landing page.
 *
 * Auto-expands the super that contains the active slug so a user landing
 * on `/products?category=safety-helmets` immediately sees PPE expanded with
 * Safety Helmets highlighted.
 */
export function ProductsSidebar({
  categoryMenu,
  activeSlug,
  search,
}: ProductsSidebarProps) {
  const t = useTranslations();
  const locale = useLocale();

  const initiallyExpanded = (() => {
    if (!activeSlug) return null;
    for (const sup of categoryMenu) {
      if (sup.slug === activeSlug) return sup.slug;
      if (sup.children.some((c) => c.slug === activeSlug)) return sup.slug;
    }
    return null;
  })();

  const [expanded, setExpanded] = useState<string | null>(initiallyExpanded);

  function toggle(slug: string) {
    setExpanded((prev) => (prev === slug ? null : slug));
  }

  function buildUrl(categorySlug: string | undefined) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  function localizedName(item: { name: string; nameCn: string | null }) {
    return locale === "cn" && item.nameCn ? item.nameCn : item.name;
  }

  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
        {t("filter.category")}
      </h3>
      <nav className="flex flex-col">
        {/* All products */}
        <Link
          href={buildUrl(undefined)}
          className={`font-body text-sm py-1.5 transition-colors ${
            !activeSlug
              ? "text-gray-900 font-medium border-l-2 border-amber-500 pl-3"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("common.all")}
        </Link>

        {/* Super categories with expandable children */}
        {categoryMenu.map((sup) => {
          const isExpanded = expanded === sup.slug;
          const isActive = sup.slug === activeSlug;

          return (
            <div key={sup.id}>
              {/* Row: name link + count + chevron toggle */}
              <div
                className={`flex items-center py-1.5 transition-colors ${
                  isActive ? "border-l-2 border-amber-500 pl-3" : ""
                }`}
              >
                <Link
                  href={buildUrl(sup.slug)}
                  className={`flex-1 font-body text-sm transition-colors ${
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {localizedName(sup)}
                </Link>
                <span className="font-mono text-xs text-gray-400 mr-2">
                  {sup.productCount}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(sup.slug)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${sup.name}`}
                  className="p-0.5 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Expanded children */}
              {isExpanded && (
                <div className="ml-2 mb-1 flex flex-col border-l border-gray-200 pl-3">
                  {sup.children.map((child) => {
                    const childActive = child.slug === activeSlug;
                    return (
                      <Link
                        key={child.id}
                        href={buildUrl(child.slug)}
                        className={`flex items-center justify-between py-1 font-body text-[13px] transition-colors ${
                          childActive
                            ? "text-amber-600 font-medium"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <span>{localizedName(child)}</span>
                        <span className="font-mono text-[10px] text-gray-400">
                          {child.productCount}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
