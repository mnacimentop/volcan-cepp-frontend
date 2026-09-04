import "server-only";

import { createDefaultHttpRetryPolicy } from "@pormeldev/axis-client-kit/server";
import { getLocale } from "next-intl/server";
import { envConfig } from "@/common/config/env.config";
import type { UiError } from "@/common/errors/ui-error";
import { normalizeUiErrorLocale, toUiError } from "@/common/errors/ui-error";
import { createAppApiClient } from "../api-client.factory";
import {
  mapHttpClientErrorPayloadToUiErrors,
  mapHttpResponseBodyToUiErrors,
} from "../http-error-mapper";
import { axisLogPublisher } from "./log-publisher";

async function resolveRequestLocale(locale?: string): Promise<string> {
  return normalizeUiErrorLocale(locale ?? (await getLocale()));
}

const retryPolicy = createDefaultHttpRetryPolicy({
  maxDelayMs: envConfig.fetchTimeoutMs,
});

/** Server-only client for Server Components, Actions and Route Handlers. */
export const apiClient = createAppApiClient<UiError>({
  baseURL: "",
  createUnknownError: (locale, detail) => toUiError("UNKNOWN_ERROR", locale, detail),
  defaultHeaders: { accept: "application/json" },
  logPublisher: axisLogPublisher,
  mapError: mapHttpClientErrorPayloadToUiErrors,
  mapHttpResponseBodyToErrors: mapHttpResponseBodyToUiErrors,
  normalizeClientLocale: normalizeUiErrorLocale,
  normalizeRequestLocale: resolveRequestLocale,
  retry: retryPolicy,
  timeoutMs: envConfig.fetchTimeoutMs,
});
