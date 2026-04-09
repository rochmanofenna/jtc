import Link from "next/link";
import { ShieldCheck, Languages, DollarSign } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";
import { SuperCategoryCard } from "@/components/catalog/super-category-card";
import { getDescendantCategoryIds } from "@/lib/category-tree";
import { getCategoryMenuData } from "@/lib/category-menu";

export default async function HomePage() {
  const t = await getTranslations();
  const categoryMenu = await getCategoryMenuData();

  // Get the 3 super-parent categories (PPE, Construction Tools, Electric Supply)
  const superCategoriesRaw = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { select: { id: true } } },
    orderBy: { sortOrder: "asc" },
  });

  // For each super, count ALL products in its subtree (any depth) and count
  // its direct children (mid categories) for the card subtitle.
  const superCategories = await Promise.all(
    superCategoriesRaw.map(async (category) => {
      const allDescendantIds = await getDescendantCategoryIds(category.id);
      const productCount = await prisma.product.count({
        where: { categoryId: { in: allDescendantIds }, isActive: true },
      });
      return {
        ...category,
        productCount,
        subcategoryCount: category.children.length,
      };
    })
  );

  const totalProducts = superCategories.reduce((sum, c) => sum + c.productCount, 0);
  const totalCategories = superCategories.length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header categoryMenu={categoryMenu} />
      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy-950 min-h-[70vh] lg:min-h-[85vh] flex items-center">
          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="container-wide relative w-full">
            <div className="max-w-3xl">
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1]"
                style={{ animation: "fadeUp 600ms ease-out 200ms both" }}
              >
                {t("hero.title")}
              </h1>
              <p
                className="font-body text-lg sm:text-xl text-gray-400 mt-6 max-w-xl"
                style={{ animation: "fadeUp 600ms ease-out 400ms both" }}
              >
                {t("hero.subtitle")}
              </p>
              <div
                className="mt-8 flex gap-4 flex-col sm:flex-row"
                style={{ animation: "fadeUp 600ms ease-out 600ms both" }}
              >
                <Link
                  href="/products"
                  className="bg-amber-500 text-navy-950 font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-amber-400 transition-colors text-center"
                >
                  {t("hero.cta")}
                </Link>
                <a
                  href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 text-white font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-white/5 transition-colors text-center"
                >
                  {t("hero.ctaWhatsApp")}
                </a>
              </div>
              <div
                className="mt-12 flex gap-8 items-center flex-wrap"
                style={{ animation: "fadeUp 600ms ease-out 800ms both" }}
              >
                <span className="font-mono text-sm text-gray-500">
                  <span className="text-amber-400">{totalProducts}+</span> Products
                </span>
                <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
                <span className="font-mono text-sm text-gray-500">
                  <span className="text-white">{totalCategories}</span> Categories
                </span>
                <span className="w-px h-4 bg-navy-700" aria-hidden="true" />
                <span className="font-mono text-sm text-gray-500">
                  <span className="text-white">Verified</span> Suppliers
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Super Categories Grid ──────────────────────────────────── */}
        <section className="bg-gray-50 py-20 lg:py-28">
          <div className="container-wide">
            <span className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-amber-500">
              {t("nav.categories")}
            </span>
            <div className="w-10 h-0.5 bg-amber-500 mt-2 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {superCategories.map((category) => (
                <SuperCategoryCard
                  key={category.id}
                  category={category}
                  productCount={category.productCount}
                  subcategoryCount={category.subcategoryCount}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ──────────────────────────────────────────── */}
        <section className="bg-navy-900 py-20 lg:py-28">
          <div className="container-wide">
            <span className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-amber-500">
              WHY WORK WITH US
            </span>
            <div className="w-10 h-0.5 bg-amber-500 mt-2 mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: ShieldCheck,
                  titleKey: "whyUs.verified.title" as const,
                  descKey: "whyUs.verified.description" as const,
                },
                {
                  icon: Languages,
                  titleKey: "whyUs.multilingual.title" as const,
                  descKey: "whyUs.multilingual.description" as const,
                },
                {
                  icon: DollarSign,
                  titleKey: "whyUs.pricing.title" as const,
                  descKey: "whyUs.pricing.description" as const,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.titleKey}
                    className="bg-navy-800 border border-navy-700 rounded-sm p-6 lg:p-8"
                  >
                    <div className="w-10 h-[3px] bg-amber-500 mb-6" />
                    <Icon className="text-amber-500 size-5 mb-4" />
                    <h3 className="font-display text-base font-semibold text-white mb-2">
                      {t(item.titleKey)}
                    </h3>
                    <p className="font-body text-sm text-gray-400 leading-relaxed">
                      {t(item.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section
          className="py-20 lg:py-28"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(245,158,11,0.06) 0%, transparent 60%), #0a0f1a",
          }}
        >
          <div className="container-wide">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white uppercase">
                {t("cta.ready")}
              </h2>
              <p className="font-body text-lg text-gray-400 mt-4">
                {t("cta.readyDescription")}
              </p>
              <div className="mt-8 flex gap-4 flex-col sm:flex-row">
                <a
                  href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 text-navy-950 font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-amber-400 transition-colors text-center"
                >
                  {t("cta.whatsapp")}
                </a>
                <Link
                  href="/products"
                  className="border border-white/20 text-white font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-white/5 transition-colors text-center"
                >
                  {t("cta.browseProducts")} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
