import { UiErrorTranslator } from "@pormeldev/axis-shared";
import { uiErrorMessages } from "@/common/errors/ui-error.messages";

export type UiError = {
  code: string;
  detail: string;
  uiMessage: string;
};

const uiErrorTranslator = new UiErrorTranslator({
  defaultLocale: "es",
  locales: ["es"] as const,
  messagesByLocale: {
    es: uiErrorMessages,
  },
});

export const { normalizeUiErrorLocale, toUiError, translateUiErrorMessage } = uiErrorTranslator;
