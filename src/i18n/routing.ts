import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],   // 👈 Change to your languages
  defaultLocale: 'en',
});

// This matches the import in proxy.ts: import { i18n } from "./i18n/routing"
export const i18n = {
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
};
