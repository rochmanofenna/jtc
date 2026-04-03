"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const router = useRouter();
  const currentLocale = useLocale();

  async function handleLocaleChange(locale: Locale) {
    if (locale === currentLocale) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    router.refresh();
  }

  return (
    <div data-slot="button-group" className="flex items-center">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? "default" : "ghost"}
          size="xs"
          className={cn(
            "rounded-none first:rounded-l-md last:rounded-r-md",
            currentLocale === locale
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "text-muted-foreground"
          )}
          onClick={() => handleLocaleChange(locale)}
        >
          {localeNames[locale]}
        </Button>
      ))}
    </div>
  );
}
