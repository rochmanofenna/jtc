"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
      <SheetContent side="left" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg font-bold">
            Jakarta Trade Connect
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          <SheetClose
            render={
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              />
            }
          >
            {t("nav.home")}
          </SheetClose>
          <SheetClose
            render={
              <Link
                href="/products"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              />
            }
          >
            {t("nav.products")}
          </SheetClose>

          <div className="my-2 border-t" />
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("nav.categories")}
          </p>

          {categories.map((cat) => (
            <SheetClose
              key={cat.slug}
              render={
                <Link
                  href={`/categories/${cat.slug}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                />
              }
            >
              {t(`categories.${cat.key}`)}
            </SheetClose>
          ))}
        </nav>

        <SheetFooter className="gap-4 border-t pt-4">
          <LanguageToggle />
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            render={
              <a
                href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircle className="size-4" />
            {t("cta.whatsapp")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
