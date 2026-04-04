"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  const t = useTranslations();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
    setSearchOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-navy-900 text-white transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.05)]" : ""
      }`}
    >
      <div className="container-wide flex h-16 items-center gap-6 lg:h-[72px]">
        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <MobileNav>
            <button
              type="button"
              className="flex flex-col justify-center gap-[5px] p-2 text-white hover:text-amber-400 transition-colors"
              aria-label="Open menu"
            >
              <span className="block h-[2px] w-5 bg-current" />
              <span className="block h-[2px] w-5 bg-current" />
              <span className="block h-[2px] w-5 bg-current" />
            </button>
          </MobileNav>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 font-display text-sm font-bold uppercase tracking-wider text-white"
        >
          <span className="hidden md:inline">JAKARTA TRADE CONNECT</span>
          <span className="md:hidden">JTC</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 lg:flex lg:ml-10">
          <NavLink href="/products">{t("nav.products")}</NavLink>
          <NavLink href="/categories/safety-helmets">
            {t("nav.categories")}
          </NavLink>
        </nav>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Search toggle */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>

          {/* Language toggle */}
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {/* CTA button */}
          <Link
            href="/products"
            className="hidden bg-amber-500 text-navy-950 font-display font-semibold text-xs uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-amber-400 transition-colors sm:inline-block"
          >
            REQUEST QUOTE
          </Link>
        </div>
      </div>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="border-t border-navy-800 bg-navy-900">
          <div className="container-wide py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t("common.searchPlaceholder")}
                autoFocus
                className="h-10 w-full rounded-sm border border-navy-700 bg-navy-800 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 font-body"
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group relative font-display text-xs font-medium uppercase tracking-wide text-gray-400 hover:text-white transition-colors">
      <span>{children}</span>
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-500 transition-all duration-200 group-hover:w-full" />
    </Link>
  );
}
