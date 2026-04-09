"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";
import type { CategoryMenuItem } from "@/lib/category-menu";

interface MobileNavProps {
  children: React.ReactNode;
  categoryMenu: CategoryMenuItem[];
}

/**
 * Mobile hamburger drawer. Renders the 3 super categories as expandable
 * sections — tapping PPE expands the list of its 10 mid-categories without
 * navigating. Tapping a mid-category closes the sheet and navigates to
 * that category page.
 *
 * Takes the category tree as a prop so the data is fetched once per
 * request by a server component parent (see src/lib/category-menu.ts).
 */
export function MobileNav({ children, categoryMenu }: MobileNavProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(slug: string) {
    setExpanded((prev) => (prev === slug ? null : slug));
  }

  function localizedName(item: { name: string; nameCn: string | null }) {
    return locale === "cn" && item.nameCn ? item.nameCn : item.name;
  }

  return (
    <Sheet>
      <SheetTrigger render={<span />}>{children}</SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="!w-full !max-w-none !border-0 bg-navy-950 text-white"
      >
        <div className="flex min-h-dvh flex-col px-8 py-6">
          {/* Top bar: logo + close */}
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
              JAKARTA TRADE CONNECT
            </span>
            <SheetClose
              render={
                <button
                  type="button"
                  className="flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                />
              }
            >
              {/* Custom X using divs */}
              <span className="relative block h-5 w-5">
                <span className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </SheetClose>
          </div>

          {/* Main nav links */}
          <nav className="mt-14 flex flex-col gap-6">
            <SheetClose
              render={
                <Link
                  href="/"
                  className="font-display text-2xl font-medium uppercase tracking-wide text-white hover:text-amber-400 transition-colors"
                />
              }
            >
              {t("nav.home")}
            </SheetClose>
            <SheetClose
              render={
                <Link
                  href="/products"
                  className="font-display text-2xl font-medium uppercase tracking-wide text-white hover:text-amber-400 transition-colors"
                />
              }
            >
              {t("nav.products")}
            </SheetClose>
          </nav>

          {/* Divider */}
          <div className="mt-8 mb-6 h-px bg-navy-800" />

          {/* Category heading */}
          <p className="font-display text-xs font-medium uppercase tracking-widest text-amber-500 mb-4">
            {t("nav.categories")}
          </p>

          {/* Expandable super categories */}
          <nav className="flex flex-col overflow-y-auto flex-1">
            {categoryMenu.map((sup) => {
              const isExpanded = expanded === sup.slug;
              return (
                <div key={sup.slug} className="border-b border-navy-800/60">
                  <button
                    type="button"
                    onClick={() => toggle(sup.slug)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between py-3.5 font-display text-lg text-white transition-colors hover:text-amber-400"
                  >
                    <span>
                      {localizedName(sup)}
                      <span className="ml-2 font-mono text-xs text-gray-500">
                        ({sup.productCount})
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-4 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-2.5 pb-4 pl-1">
                      <SheetClose
                        render={
                          <Link
                            href={`/categories/${sup.slug}`}
                            className="font-body text-sm font-medium text-amber-500 transition-colors hover:text-amber-400"
                          />
                        }
                      >
                        {t("common.viewAll")} {localizedName(sup)}
                      </SheetClose>
                      {sup.children.map((child) => (
                        <SheetClose
                          key={child.slug}
                          render={
                            <Link
                              href={`/categories/${child.slug}`}
                              className="font-body text-sm text-gray-400 transition-colors hover:text-white"
                            />
                          }
                        >
                          {localizedName(child)}
                          <span className="ml-1 font-mono text-[10px] text-gray-500">
                            ({child.productCount})
                          </span>
                        </SheetClose>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="mt-8 flex flex-col gap-5 pb-4">
            <LanguageToggle />
            <a
              href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-amber-500 text-navy-950 font-display font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-amber-400 transition-colors"
            >
              {t("cta.whatsapp")}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
