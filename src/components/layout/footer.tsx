import Link from "next/link";
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
    <footer className="bg-navy-950 text-white">
      <div className="container-wide py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div className="space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-white text-sm">
              JAKARTA TRADE CONNECT
            </h3>
            <p className="font-body text-sm leading-relaxed text-gray-500 max-w-xs">
              {footerText.description}
            </p>
            <div className="w-10 h-0.5 bg-amber-500" />
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-amber-500 mb-4">
              PRODUCTS
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/categories/safety-helmets"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                Safety Helmets
              </Link>
              <Link
                href="/categories/gloves"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                Gloves
              </Link>
              <Link
                href="/categories/safety-footwear"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                Safety Shoes
              </Link>
              <Link
                href="/categories/power-tools-battery"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                Power Tools
              </Link>
              <Link
                href="/products"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                View All Products
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-amber-500 mb-4">
              CONTACT
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href={formatWhatsAppUrl(WHATSAPP_NUMBER, "")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-gray-400 transition-colors hover:text-white"
              >
                {footerText.whatsapp}
              </a>
              <p className="font-body text-sm text-gray-500">
                Jakarta, Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider + bottom bar */}
      <div className="border-t border-navy-700">
        <div className="container-wide flex h-14 items-center justify-center">
          <p className="font-body text-xs text-gray-600">
            {footerText.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
