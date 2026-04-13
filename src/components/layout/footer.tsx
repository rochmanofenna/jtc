import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-wide py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div className="space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-white text-sm">
              JAKARTA TRADE CONNECT
            </h3>
            <p className="font-body text-sm leading-relaxed text-gray-500 max-w-xs">
              {t("footer.description")}
            </p>
            <div className="w-10 h-0.5 bg-amber-500" />
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-amber-500 mb-4">
              {t("footer.products")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/categories/ppe"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t("categories.ppe")}
              </Link>
              <Link
                href="/categories/construction-tools"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t("categories.construction-tools")}
              </Link>
              <Link
                href="/categories/electric-supply"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t("categories.electric-supply")}
              </Link>
              <Link
                href="/products"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t("common.viewAllProducts")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-amber-500 mb-4">
              {t("footer.contact")}
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t("footer.whatsapp")}
              </a>
              <p className="font-body text-sm text-gray-500">
                {t("footer.location")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider + bottom bar */}
      <div className="border-t border-navy-700">
        <div className="container-wide flex h-14 items-center justify-center">
          <p className="font-body text-xs text-gray-600">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
