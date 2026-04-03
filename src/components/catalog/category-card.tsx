import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { CATEGORY_ICONS } from "@/lib/constants";

interface CategoryCardProps {
  category: any;
  locale?: string;
}

export function CategoryCard({ category, locale }: CategoryCardProps) {
  const iconName = category.icon || CATEGORY_ICONS[category.slug] || "Package";
  const Icon = getIcon(iconName);
  const productCount = category._count?.products ?? 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block min-h-[120px] rounded-xl border bg-card p-5 transition-all duration-200 hover:border-b-2 hover:border-b-accent hover:shadow-md"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="size-5 text-primary" />
          </div>
          {productCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {productCount}
            </Badge>
          )}
        </div>
        <h3 className="font-heading text-sm font-semibold leading-snug">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
