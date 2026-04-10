import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a string to a URL-friendly slug.
 * Lowercases, strips non-word characters, and replaces whitespace with hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a WhatsApp click-to-chat URL.
 */
export function formatWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

/**
 * Return a localized WhatsApp inquiry message for a product.
 */
export function getWhatsAppQuoteMessage(
  productName: string,
  locale: string,
): string {
  switch (locale) {
    case "id":
      return `Halo, saya tertarik dengan produk "${productName}". Bisa minta info harga dan MOQ?`;
    case "cn":
      return `\u4F60\u597D\uFF0C\u6211\u5BF9\u4EA7\u54C1\u201C${productName}\u201D\u611F\u5174\u8DA3\u3002\u8BF7\u95EE\u4EF7\u683C\u548CMOQ\u662F\u591A\u5C11\uFF1F`;
    default:
      return `Hi, I'm interested in "${productName}". Could you share the price and MOQ?`;
  }
}

/**
 * Build a fully-formatted WhatsApp message containing all data collected by
 * the QuoteInquiry form. Trilingual (id / en / cn).
 *
 * Used by the QuoteInquiryModal — the message body becomes the `text` query
 * param of the wa.me URL so the supplier opens WhatsApp with everything
 * pre-filled and just needs to hit send.
 */
export interface QuoteInquiryMessageData {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  npwp?: string;
  ktpSim?: string;
  message: string;
  productName?: string;
  productSlug?: string;
}

export function buildQuoteInquiryMessage(
  data: QuoteInquiryMessageData,
  locale: string,
): string {
  const {
    companyName, address, email, phone, npwp, ktpSim,
    message, productName, productSlug,
  } = data;

  const labels = (() => {
    switch (locale) {
      case "id":
        return {
          header: "*Permintaan Penawaran — Jakarta Trade Connect*",
          companyName: "Nama Toko/PT/CV",
          address: "Alamat",
          email: "Email",
          phone: "No Telepon",
          npwp: "NPWP",
          ktpSim: "No KTP/SIM",
          product: "Produk",
          sku: "Kode Produk",
          requirements: "Kebutuhan",
        };
      case "cn":
        return {
          header: "*\u62A5\u4EF7\u8BF7\u6C42 — Jakarta Trade Connect*",
          companyName: "\u516C\u53F8/\u5E97\u94FA\u540D\u79F0",
          address: "\u5730\u5740",
          email: "\u90AE\u7BB1",
          phone: "\u7535\u8BDD",
          npwp: "\u7A0E\u53F7",
          ktpSim: "\u8EAB\u4EFD\u8BC1\u53F7",
          product: "\u4EA7\u54C1",
          sku: "\u4EA7\u54C1\u7F16\u53F7",
          requirements: "\u9700\u6C42",
        };
      default:
        return {
          header: "*Quote Request — Jakarta Trade Connect*",
          companyName: "Company/Store",
          address: "Address",
          email: "Email",
          phone: "Phone",
          npwp: "NPWP",
          ktpSim: "KTP/SIM",
          product: "Product",
          sku: "Product Code",
          requirements: "Requirements",
        };
    }
  })();

  const lines: string[] = [];
  lines.push(labels.header);
  lines.push("");

  if (productName) {
    lines.push(`*${labels.product}:* ${productName}`);
    if (productSlug) {
      lines.push(`*${labels.sku}:* ${productSlug}`);
    }
    lines.push("");
  }

  lines.push(`*${labels.companyName}:* ${companyName}`);
  lines.push(`*${labels.address}:* ${address}`);
  lines.push(`*${labels.email}:* ${email}`);
  lines.push(`*${labels.phone}:* ${phone}`);
  if (npwp) {
    lines.push(`*${labels.npwp}:* ${npwp}`);
  }
  if (ktpSim) {
    lines.push(`*${labels.ktpSim}:* ${ktpSim}`);
  }
  lines.push("");
  lines.push(`*${labels.requirements}:*`);
  lines.push(message);

  return lines.join("\n");
}

/**
 * Truncate a string to the given length, appending an ellipsis if trimmed.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "\u2026";
}
