"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";

const categories = [
  { slug: "safety-helmets", key: "safety-helmets" },
  { slug: "masks-respirators", key: "masks-respirators" },
  { slug: "body-harnesses", key: "body-harnesses" },
  { slug: "reflective-vests", key: "reflective-vests" },
  { slug: "rainwear", key: "rainwear" },
  { slug: "protective-clothing", key: "protective-clothing" },
  { slug: "gloves", key: "gloves" },
  { slug: "safety-footwear", key: "safety-footwear" },
  { slug: "welding-equipment", key: "welding-equipment" },
  { slug: "life-safety", key: "life-safety" },
  { slug: "anti-static", key: "anti-static" },
  { slug: "power-tools-battery", key: "power-tools-battery" },
  { slug: "power-tools-ac", key: "power-tools-ac" },
  { slug: "cutting-grinding-discs", key: "cutting-grinding-discs" },
  { slug: "tapes-ties-packaging", key: "tapes-ties-packaging" },
  { slug: "woven-products", key: "woven-products" },
  { slug: "traffic-safety", key: "traffic-safety" },
  { slug: "site-equipment", key: "site-equipment" },
] as const;

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const t = useTranslations();

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

          {/* Category links */}
          <nav className="flex flex-col gap-3 overflow-y-auto flex-1">
            {categories.map((cat) => (
              <SheetClose
                key={cat.slug}
                render={
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="font-display text-lg text-gray-400 hover:text-white transition-colors"
                  />
                }
              >
                {t(`categories.${cat.key}`)}
              </SheetClose>
            ))}
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
