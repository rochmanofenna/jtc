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
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  productName?: string;
  productSlug?: string;
}

export function buildQuoteInquiryMessage(
  data: QuoteInquiryMessageData,
  locale: string,
): string {
  const { name, email, phone, company, message, productName, productSlug } = data;

  const labels = (() => {
    switch (locale) {
      case "id":
        return {
          header: "*Permintaan Penawaran — Jakarta Trade Connect*",
          name: "Nama",
          email: "Email",
          phone: "Telepon",
          company: "Perusahaan",
          product: "Produk",
          sku: "Kode Produk",
          requirements: "Kebutuhan",
        };
      case "cn":
        return {
          header: "*\u62A5\u4EF7\u8BF7\u6C42 — Jakarta Trade Connect*",
          name: "\u59D3\u540D",
          email: "\u90AE\u7BB1",
          phone: "\u7535\u8BDD",
          company: "\u516C\u53F8",
          product: "\u4EA7\u54C1",
          sku: "\u4EA7\u54C1\u7F16\u53F7",
          requirements: "\u9700\u6C42",
        };
      default:
        return {
          header: "*Quote Request — Jakarta Trade Connect*",
          name: "Name",
          email: "Email",
          phone: "Phone",
          company: "Company",
          product: "Product",
          sku: "SKU",
          requirements: "Requirements",
        };
    }
  })();

  const lines: string[] = [];
  lines.push(labels.header);
  lines.push("");
  lines.push(`*${labels.name}:* ${name}`);
  lines.push(`*${labels.email}:* ${email}`);
  lines.push(`*${labels.phone}:* ${phone}`);
  if (company) {
    lines.push(`*${labels.company}:* ${company}`);
  }
  if (productName) {
    lines.push("");
    lines.push(`*${labels.product}:* ${productName}`);
    if (productSlug) {
      lines.push(`*${labels.sku}:* ${productSlug}`);
    }
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
