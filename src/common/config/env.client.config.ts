/**
 * Client-safe config with NODE_ENV flags.
 * Safe to import in both Server and Client Components.
 */

type Env = "development" | "test" | "production";

const env: Env = (process.env.NODE_ENV as Env) ?? "development";

export const clientEnvConfig = {
  env,
  isDev: env === "development",
  isTest: env === "test",
  isProd: env === "production",
} as const;
