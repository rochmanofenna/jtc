"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  categories: any[];
  materials: string[];
  activeFilters: Record<string, string>;
}

export function FilterPanel({
  categories,
  materials,
  activeFilters,
}: FilterPanelProps) {
  const t = useTranslations("filter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = Object.keys(activeFilters).some(
    (key) => activeFilters[key]
  );

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to first page when filtering
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    // Keep only search param if present
    const search = searchParams.get("search");
    if (search) {
      params.set("search", search);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="space-y-6">
      {/* Header with clear */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold">{t("title")}</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAll}
            className="text-xs text-muted-foreground"
          >
            <X className="size-3" />
            {t("clearAll")}
          </Button>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("category")}
          </h3>
          <ul className="space-y-0.5">
            {categories.map((cat) => {
              const isActive = activeFilters.category === cat.slug;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => updateFilter("category", cat.slug)}
                    className={cn(
                      "w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Material filter */}
      {materials.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("material")}
          </h3>
          <ul className="space-y-0.5">
            {materials.map((material) => {
              const isActive = activeFilters.material === material;
              return (
                <li key={material}>
                  <button
                    onClick={() => updateFilter("material", material)}
                    className={cn(
                      "w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {material}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
