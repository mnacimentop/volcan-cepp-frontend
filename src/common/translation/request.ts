import { createIntlRequestConfig } from "@pormeldev/next-runtime-kit/i18n";
import enMessages from "./locales/en.json";
import esMessages from "./locales/es.json";
import { routing } from "./routing";

const messagesByLocale: Record<string, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
};

export default createIntlRequestConfig({
  getMessages: async (locale) => messagesByLocale[locale] ?? esMessages,
  routing,
});
