import { UiErrorTranslator } from "@pormeldev/axis-shared";
import enMessages from "@/common/translation/locales/en.json";
import esMessages from "@/common/translation/locales/es.json";

export type UiError = {
  code: string;
  detail: string;
  uiMessage: string;
};

const uiErrorTranslator = new UiErrorTranslator({
  defaultLocale: "es",
  locales: ["es", "en"] as const,
  messagesByLocale: {
    en: enMessages,
    es: esMessages,
  },
});

export const { normalizeUiErrorLocale, toUiError, translateUiErrorMessage } = uiErrorTranslator;
