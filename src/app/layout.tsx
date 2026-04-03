import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
      className={`${jakarta.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
