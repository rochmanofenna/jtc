"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/50 bg-navy-900/95 text-white backdrop-blur supports-backdrop-filter:bg-navy-900/80">
      <div className="container-wide flex h-14 items-center gap-4">
        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <MobileNav>
            <Button variant="ghost" size="icon" className="text-white hover:bg-navy-800">
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </MobileNav>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 font-heading text-xl font-bold tracking-tight text-white"
        >
          <span className="hidden md:inline">Jakarta Trade Connect</span>
          <span className="md:hidden">JTC</span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 lg:flex lg:max-w-md lg:mx-auto"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="h-8 w-full rounded-lg border border-navy-700 bg-navy-800/60 pl-9 pr-3 text-sm text-white placeholder:text-navy-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/50"
            />
          </div>
        </form>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            size="sm"
            render={
              <a
                href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
