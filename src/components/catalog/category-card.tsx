import Link from "next/link";
import { getIcon } from "@/lib/icons";

interface CategoryCardProps {
  category: any;
  productCount?: number;
  locale?: string;
}

export function CategoryCard({ category, productCount, locale }: CategoryCardProps) {
  const Icon = getIcon(category.icon);
  const count = productCount ?? category._count?.products ?? 0;

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group rounded-xl border border-border bg-card p-5 text-center transition-all duration-200 hover:shadow-lg hover:border-accent/40 hover:-translate-y-1 cursor-pointer">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-sm font-semibold mb-1">
          {locale === "cn" && category.nameCn ? category.nameCn : category.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "product" : "products"}
        </p>
      </div>
    </Link>
  );
}
