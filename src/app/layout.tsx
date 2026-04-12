import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { QuoteModalProvider } from "@/context/quote-modal-provider";
import { FloatingQuoteButton } from "@/components/catalog/floating-quote-button";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Jakarta Trade Connect — Industrial Safety & Tools Direct from Factory",
    template: "%s | Jakarta Trade Connect",
  },
  description:
    "B2B procurement platform connecting Indonesian buyers with verified Chinese industrial suppliers. Safety equipment, tools, and construction materials at factory-direct prices.",
  keywords: [
    "industrial safety equipment Indonesia",
    "PPE supplier Indonesia",
    "alat keselamatan kerja",
    "helm safety",
    "sarung tangan safety",
    "Chinese manufacturer Indonesia",
    "B2B procurement Indonesia",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <NextIntlClientProvider messages={messages}>
          <QuoteModalProvider>
            {children}
            <FloatingQuoteButton />
          </QuoteModalProvider>
          <Toaster position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
