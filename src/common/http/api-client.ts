import type { UiError } from "@/common/errors/ui-error";
import { normalizeUiErrorLocale, toUiError } from "@/common/errors/ui-error";
import { createAppApiClient } from "./api-client.factory";
import {
  mapHttpClientErrorPayloadToUiErrors,
  mapHttpResponseBodyToUiErrors,
} from "./http-error-mapper";

/** Browser-safe client for requests initiated from Client Components. */
export const apiClient = createAppApiClient<UiError>({
  baseURL: "",
  createUnknownError: (locale, detail) =>
    toUiError("UNKNOWN_ERROR", normalizeUiErrorLocale(locale), detail),
  defaultHeaders: { accept: "application/json" },
  mapError: mapHttpClientErrorPayloadToUiErrors,
  mapHttpResponseBodyToErrors: mapHttpResponseBodyToUiErrors,
  normalizeClientLocale: normalizeUiErrorLocale,
  normalizeRequestLocale: normalizeUiErrorLocale,
  timeoutMs: 10_000,
});
