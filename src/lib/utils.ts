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
 * Truncate a string to the given length, appending an ellipsis if trimmed.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "\u2026";
}
