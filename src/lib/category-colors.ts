/**
 * Returns a Tailwind text color class for the category label based on which
 * super-category the product's category belongs to.
 *
 * PPE categories → amber-600 (warm, safety)
 * Construction Tools → blue-500 (industrial, technical)
 * Electric Supply → green-500 (energy, power)
 *
 * Falls back to amber-600 for unknown categories.
 */

const constructionSlugs = new Set([
  "construction-tools",
  "power-tools-battery",
  "power-tools-ac",
  "cutting-grinding-discs",
  "tapes-ties-packaging",
  "traffic-safety",
  "site-equipment",
  "woven-products",
]);

const electricSlugs = new Set([
  "electric-supply",
  "anti-static",
  "energy-storage",
  "inverters",
  "energy-storage-systems",
  "all-in-one-systems",
  "solar-power",
  "smart-building",
  "lifepo4-batteries",
  "rack-mount-batteries",
  "wall-mount-batteries",
  "standing-batteries",
  "stackable-batteries",
  "high-voltage-batteries",
  "off-grid-inverters",
  "hybrid-inverters",
  "three-phase-inverters",
  "rack-mount-ess",
  "ip54-sealed-ess",
  "ev-charging-storage",
  "wall-mount-aio",
  "standing-aio",
  "stackable-aio",
  "security-sensors",
  "smart-control-panels",
  "smart-switches",
  "smart-locks",
  "smart-motors-accessories",
]);

export function getCategoryLabelColor(categorySlug?: string): string {
  if (!categorySlug) return "text-amber-600";
  if (constructionSlugs.has(categorySlug)) return "text-blue-500";
  if (electricSlugs.has(categorySlug)) return "text-green-600";
  return "text-amber-600"; // PPE + fallback
}
