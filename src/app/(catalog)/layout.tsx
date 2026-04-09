import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCategoryMenuData } from "@/lib/category-menu";

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoryMenu = await getCategoryMenuData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categoryMenu={categoryMenu} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
