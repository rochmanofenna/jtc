import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";

interface FooterProps {
  locale?: string;
  messages?: {
    description: string;
    quickLinks: string;
    contactUs: string;
    copyright: string;
    whatsapp: string;
  };
  navMessages?: {
    home: string;
    products: string;
    categories: string;
  };
}

export function Footer({ locale = "id", messages, navMessages }: FooterProps) {
  const footerText = messages ?? {
    description:
      "B2B procurement platform for industrial safety equipment and tools direct from Chinese factories.",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    copyright: "\u00a9 2026 Jakarta Trade Connect. All rights reserved.",
    whatsapp: "WhatsApp",
  };

  const navText = navMessages ?? {
    home: "Home",
    products: "Products",
    categories: "Categories",
  };

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-wide py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-white">
              Jakarta Trade Connect
            </h3>
            <p className="text-sm leading-relaxed text-navy-300">
              {footerText.description}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white">
              {footerText.quickLinks}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-navy-300 transition-colors hover:text-white"
              >
                {navText.home}
              </Link>
              <Link
                href="/products"
                className="text-sm text-navy-300 transition-colors hover:text-white"
              >
                {navText.products}
              </Link>
              <Link
                href="/categories/safety-helmets"
                className="text-sm text-navy-300 transition-colors hover:text-white"
              >
                {navText.categories}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white">
              {footerText.contactUs}
            </h4>
            <a
              href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-navy-300 transition-colors hover:text-white"
            >
              <MessageCircle className="size-4" />
              {footerText.whatsapp}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="container-wide flex h-12 items-center justify-center">
          <p className="text-xs text-navy-400">{footerText.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
