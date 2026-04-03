export const APP_NAME = "Jakarta Trade Connect";
export const APP_NAME_SHORT = "JTC";
export const DEFAULT_LOCALE = "id";
export const LOCALES = ["id", "en", "cn"] as const;
export type Locale = (typeof LOCALES)[number];
export const ITEMS_PER_PAGE = 24;
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+6281234567890";

export const CATEGORY_ICONS: Record<string, string> = {
  "safety-helmets": "HardHat",
  "masks-respirators": "Shield",
  "body-harnesses": "Anchor",
  "reflective-vests": "Eye",
  "rainwear": "CloudRain",
  "protective-clothing": "Shirt",
  "gloves": "Hand",
  "safety-footwear": "Footprints",
  "welding-equipment": "Flame",
  "life-safety": "LifeBuoy",
  "anti-static": "Zap",
  "power-tools-battery": "BatteryCharging",
  "power-tools-ac": "Plug",
  "cutting-grinding-discs": "Disc3",
  "tapes-ties-packaging": "Package",
  "woven-products": "Grid3x3",
  "traffic-safety": "Construction",
  "site-equipment": "Building",
};
