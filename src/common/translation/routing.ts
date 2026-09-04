import { createIntlRouting } from "@pormeldev/next-runtime-kit/i18n";

export const routing = createIntlRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
