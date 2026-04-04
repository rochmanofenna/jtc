import Link from "next/link";
import { ShieldCheck, Languages, BadgeDollarSign, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";
import { CategoryCard } from "@/components/catalog/category-card";

export default async function HomePage() {
  const t = await getTranslations();

  // Get parent categories with their children
  const categoriesRaw = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { select: { id: true } } },
    orderBy: { sortOrder: "asc" },
  });

  // Count products across parent + all children for each
  const categoriesWithCounts = await Promise.all(
    categoriesRaw.map(async (category) => {
      const categoryIds = [category.id, ...category.children.map((c: any) => c.id)];
      const productCount = await prisma.product.count({
        where: { categoryId: { in: categoryIds }, isActive: true },
      });
      return { ...category, productCount };
    })
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 to-navy-950">
          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="container-wide relative py-20 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-heading text-4xl font-bold text-white lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">
                {t("hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  className="h-11 bg-accent px-6 text-accent-foreground hover:bg-accent/90"
                  size="lg"
                  render={<Link href="/products" />}
                >
                  {t("hero.cta")}
                </Button>
                <Button
                  variant="outline"
                  className="h-11 border-white/30 px-6 text-white hover:bg-white/10 hover:text-white"
                  size="lg"
                  render={
                    <a
                      href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircle className="size-4" />
                  {t("hero.ctaWhatsApp")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories Grid ────────────────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="container-wide">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              {t("nav.categories")}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categoriesWithCounts.map((category: any) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={category.productCount}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Us ─────────────────────────────────────────────────── */}
        <section className="bg-muted/50 py-16 lg:py-24">
          <div className="container-wide">
            <h2 className="text-center font-heading text-2xl font-bold text-foreground lg:text-3xl">
              {t("whyUs.title")}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
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
                  icon: BadgeDollarSign,
                  titleKey: "whyUs.pricing.title" as const,
                  descKey: "whyUs.pricing.description" as const,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.titleKey}>
                    <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Icon className="size-7" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t(item.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
          <div className="container-wide text-center">
            <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">
              {t("cta.ready")}
            </h2>
            <p className="mt-3 text-lg text-white/90">
              {t("cta.readyDescription")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                className="h-11 bg-white px-6 text-orange-600 hover:bg-white/90"
                size="lg"
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
              <Button
                size="lg"
                className="bg-white text-orange-600 border-white hover:bg-orange-50 font-semibold"
                render={<Link href="/products" />}
              >
                {t("cta.browseProducts")}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
