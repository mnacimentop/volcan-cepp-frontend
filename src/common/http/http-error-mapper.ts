import { HttpErrorMapper } from "@pormeldev/axis-shared";
import type { UiError } from "@/common/errors/ui-error";
import { normalizeUiErrorLocale, toUiError } from "@/common/errors/ui-error";

const httpErrorMapper = new HttpErrorMapper<UiError>({
  createError: (code, locale, detail) => toUiError(code, normalizeUiErrorLocale(locale), detail),
});

export const {
  mapHttpClientErrorPayloadToErrors: mapHttpClientErrorPayloadToUiErrors,
  mapHttpResponseBodyToErrors: mapHttpResponseBodyToUiErrors,
} = httpErrorMapper;
