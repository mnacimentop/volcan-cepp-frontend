/**
 * Server-only config. Extends clientEnvConfig with private env vars.
 * Do NOT import this in Client Components — use clientEnvConfig instead.
 */

import "server-only";

import { createEnvReader } from "@pormeldev/axis-client-kit/server";
import { clientEnvConfig } from "./env.client.config";

const env = createEnvReader({
  isProd: clientEnvConfig.isProd,
  source: process.env,
});

export const envConfig = {
  ...clientEnvConfig,

  fetchTimeoutMs: env.readNumber("FETCH_TIMEOUT_MS", 30000),
} as const;
