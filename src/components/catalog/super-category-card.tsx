import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";

interface SuperCategoryCardProps {
  category: {
    id: string;
    name: string;
    nameCn: string | null;
    slug: string;
    icon: string | null;
  };
  productCount: number;
  subcategoryCount: number;
}

/**
 * Large, prominent card used on the homepage to showcase one of the
 * 3 super-categories (PPE, Construction Tools, Electric Supply).
 *
 * Compared to the standard CategoryCard, this is taller, claims a third of
 * the row on desktop, and shows both product and subcategory counts so a
 * first-time visitor can immediately gauge the breadth of each section.
 */
export async function SuperCategoryCard({
  category,
  productCount,
  subcategoryCount,
}: SuperCategoryCardProps) {
  const locale = await getLocale();
  const t = await getTranslations();
  const Icon = getIcon(category.icon ?? "Package");

  // Localized name: prefer the categories.<slug> translation key if present,
  // fall back to nameCn for Chinese, then to the DB name.
  let displayName = category.name;
  try {
    const translated = t(`categories.${category.slug}` as never);
    if (translated && translated !== `categories.${category.slug}`) {
      displayName = translated;
    }
  } catch {
    // missing translation — fall through to defaults below
  }
  if (locale === "cn" && category.nameCn) {
    displayName = category.nameCn;
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block"
    >
      <div className="relative h-full min-h-[280px] sm:min-h-[320px] overflow-hidden rounded-xl border border-border bg-card p-8 lg:p-10 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl">
        {/* Accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-amber-500 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-500/20">
          <Icon className="h-8 w-8" />
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {displayName}
        </h3>

        {/* Chinese subtitle */}
        {category.nameCn && locale !== "cn" && (
          <p className="font-body text-sm text-gray-400 mt-1.5">
            {category.nameCn}
          </p>
        )}

        {/* Counts */}
        <div className="mt-6 flex items-center gap-4 font-mono text-xs text-gray-500">
          <span>
            <span className="text-amber-600 font-semibold">{productCount}</span>{" "}
            {t("common.products" as never)}
          </span>
          <span className="w-px h-3 bg-gray-300" aria-hidden="true" />
          <span>
            <span className="text-gray-700 font-semibold">{subcategoryCount}</span>{" "}
            {t("common.categories" as never)}
          </span>
        </div>

        {/* CTA chevron */}
        <div className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-amber-500 group-hover:text-white group-hover:translate-x-1">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
