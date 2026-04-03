export const locales = ['id', 'en', 'cn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';
export const localeNames: Record<Locale, string> = { id: 'ID', en: 'EN', cn: '中文' };
