import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { getCategoryMenuData } from "@/lib/category-menu";

export default async function NotFound() {
  const t = await getTranslations("404");
  const categoryMenu = await getCategoryMenuData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categoryMenu={categoryMenu} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <p className="font-heading text-7xl font-bold text-navy-900">404</p>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
            render={<Link href="/" />}
          >
            {t("backHome")}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
