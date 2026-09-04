import {
  type AuthorizedApiClientConfig,
  type CreateLocalizedHttpClientsConfig,
  createAuthorizedApiClient,
  createLocalizedHttpClients,
} from "@pormeldev/axis-client-kit";

type AppApiClientConfig<TError> = Omit<
  CreateLocalizedHttpClientsConfig<TError>,
  "normalizeLocale"
> &
  Pick<
    AuthorizedApiClientConfig<TError>,
    "createUnknownError" | "logPublisher" | "mapHttpResponseBodyToErrors"
  > & {
    normalizeClientLocale?: (locale?: string) => string;
    normalizeRequestLocale: AuthorizedApiClientConfig<TError>["normalizeLocale"];
  };

/**
 * Composes the common HTTP behavior without reading environment variables or
 * request state. Each runtime creates its own instance from this factory.
 */
export function createAppApiClient<TError>(config: AppApiClientConfig<TError>) {
  const {
    createUnknownError,
    logPublisher,
    mapHttpResponseBodyToErrors,
    normalizeClientLocale = (locale) => locale ?? "es",
    normalizeRequestLocale,
    ...localizedConfig
  } = config;
  const clients = createLocalizedHttpClients<TError>({
    ...localizedConfig,
    normalizeLocale: normalizeClientLocale,
  });

  return createAuthorizedApiClient<TError>({
    baseClient: clients.baseClient,
    createUnknownError,
    getClientForLocale: clients.getClient,
    logPublisher,
    mapHttpResponseBodyToErrors,
    normalizeLocale: normalizeRequestLocale,
  });
}
