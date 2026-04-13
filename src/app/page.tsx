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
import { TrustSignals } from "@/components/catalog/trust-signals";
import { HomepageCTAButton } from "@/components/catalog/homepage-cta-button";
import { FeaturedCarousel } from "@/components/catalog/featured-carousel";
import { HeroProductMontage } from "@/components/catalog/hero-product-montage";
import { HeroStatsBar } from "@/components/catalog/hero-stats-bar";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

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

  // Featured products — pull ~4 per supplier with images, then interleave
  // so the carousel showcases all three suppliers side by side.
  const suppliers = await prisma.company.findMany({
    where: { type: "supplier" },
    select: { id: true },
  });

  const perSupplierProducts = await Promise.all(
    suppliers.map((s) =>
      prisma.product.findMany({
        where: {
          isActive: true,
          supplierId: s.id,
          images: { some: {} },
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
          supplier: { select: { name: true } },
        },
        take: 4,
        orderBy: { sortOrder: "asc" },
      })
    )
  );

  // Interleave: take one from each supplier in round-robin order.
  const interleaved: typeof perSupplierProducts[0] = [];
  const maxLen = Math.max(...perSupplierProducts.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of perSupplierProducts) {
      if (bucket[i]) interleaved.push(bucket[i]);
    }
  }

  const featuredProducts = interleaved.slice(0, 12).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    supplier: p.supplier,
    imageUrl: p.images[0]?.url ?? null,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header categoryMenu={categoryMenu} />
      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy-950 min-h-[55vh] sm:min-h-[60vh] lg:min-h-[75vh] flex items-center">
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
            {/* Product montage — desktop right side */}
            <HeroProductMontage
              products={featuredProducts
                .filter((p) => p.imageUrl)
                .slice(0, 4)
                .map((p) => ({
                  name: p.name,
                  imageUrl: p.imageUrl!,
                  category: p.category?.name ?? "",
                }))}
            />
            <div className="max-w-3xl lg:max-w-[55%]">
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
                className="mt-8 flex gap-3 sm:gap-4 flex-col sm:flex-row"
                style={{ animation: "fadeUp 600ms ease-out 600ms both" }}
              >
                <Link
                  href="/products"
                  className="bg-amber-500 text-navy-950 font-display font-semibold text-sm uppercase tracking-wide px-8 h-14 sm:h-auto sm:py-4 rounded-sm hover:bg-amber-400 transition-colors text-center flex items-center justify-center"
                >
                  {t("hero.cta")}
                </Link>
                <a
                  href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 text-white font-display font-semibold text-sm uppercase tracking-wide px-8 h-14 sm:h-auto sm:py-4 rounded-sm hover:bg-white/5 transition-colors text-center flex items-center justify-center"
                >
                  {t("hero.ctaWhatsApp")}
                </a>
              </div>
              <div
                className="mt-10"
                style={{ animation: "fadeUp 600ms ease-out 800ms both" }}
              >
                <HeroStatsBar
                  totalProducts={totalProducts}
                  totalCategories={totalCategories}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Products Carousel ────────────────────────────── */}
        <FeaturedCarousel products={featuredProducts} />

        {/* ── Super Categories Grid ──────────────────────────────────── */}
        <section className="bg-gray-50 py-12 lg:py-16 relative">
          {/* Gradient transition from white carousel section above */}
          <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-white to-gray-50" />
          <div className="container-wide">
            <AnimateOnScroll>
              <span className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-amber-500">
                {t("nav.categories")}
              </span>
              <div className="w-10 h-0.5 bg-amber-500 mt-2 mb-10" />
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {superCategories.map((category, i) => (
                <AnimateOnScroll key={category.id} delay={i * 150}>
                  <SuperCategoryCard
                    category={category}
                    productCount={category.productCount}
                    subcategoryCount={category.subcategoryCount}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ──────────────────────────────────────────── */}
        <section className="bg-navy-900 py-12 lg:py-16 relative">
          {/* Gradient transition from gray categories section above */}
          <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-gray-50 to-navy-900" />
          <div className="container-wide">
            <AnimateOnScroll>
              <span className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-amber-500">
                WHY WORK WITH US
              </span>
              <div className="w-10 h-0.5 bg-amber-500 mt-2 mb-8" />
            </AnimateOnScroll>
            {/* Horizontal accent line across all 3 cards */}
            <div className="h-px bg-amber-500/30 mb-8 hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {[
                {
                  icon: ShieldCheck,
                  titleKey: "whyUs.verified.title" as const,
                  descKey: "whyUs.verified.description" as const,
                  num: "01",
                },
                {
                  icon: Languages,
                  titleKey: "whyUs.multilingual.title" as const,
                  descKey: "whyUs.multilingual.description" as const,
                  num: "02",
                },
                {
                  icon: DollarSign,
                  titleKey: "whyUs.pricing.title" as const,
                  descKey: "whyUs.pricing.description" as const,
                  num: "03",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <AnimateOnScroll key={item.titleKey} delay={i * 150}>
                    <div
                      className={`p-6 lg:p-8 ${
                        i < 2 ? "sm:border-r sm:border-navy-700/50" : ""
                      } ${i > 0 ? "border-t border-navy-700/50 sm:border-t-0" : ""}`}
                    >
                      <span className="font-mono text-3xl font-bold text-navy-700 block mb-4">
                        {item.num}
                      </span>
                      <Icon className="text-amber-500 size-5 mb-4" />
                      <h3 className="font-display text-base font-semibold text-white mb-2">
                        {t(item.titleKey)}
                      </h3>
                      <p className="font-body text-sm text-gray-400 leading-relaxed">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section
          className="py-16 lg:py-20 cta-gradient-bg"
        >
          <div className="container-wide">
            <AnimateOnScroll>
              <div className="max-w-2xl">
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-white uppercase">
                  {t("cta.ready")}
                </h2>
                <p className="font-body text-lg text-gray-400 mt-4">
                  {t("cta.readyDescription")}
                </p>
              <div className="mt-8 flex gap-4 flex-col sm:flex-row">
                <HomepageCTAButton />
                <Link
                  href="/products"
                  className="border border-white/20 text-white font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-white/5 transition-colors text-center"
                >
                  {t("cta.browseProducts")} →
                </Link>
              </div>
              <TrustSignals variant="dark" />
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
