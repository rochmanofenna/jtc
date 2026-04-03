"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: any[];
  activeSlug?: string;
  locale?: string;
}

export function CategoryNav({
  categories,
  activeSlug,
  locale,
}: CategoryNavProps) {
  const t = useTranslations();

  return (
    <>
      {/* Desktop vertical list */}
      <nav className="hidden lg:block">
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/products"
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                !activeSlug
                  ? "border-l-2 border-accent font-bold text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t("common.all")} {t("nav.products")}
            </Link>
          </li>
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            const count = cat._count?.products ?? 0;
            return (
              <li key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-l-2 border-accent font-bold text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile horizontal scroll pills */}
      <nav className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/products"
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              !activeSlug
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t("common.all")}
          </Link>
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            const count = cat._count?.products ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.name}
                {count > 0 && (
                  <span className="text-xs opacity-70">{count}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
