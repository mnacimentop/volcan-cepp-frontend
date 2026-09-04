import { Button, Text } from "@pormeldev/axis-design-system";
import { getLocale, getTranslations } from "next-intl/server";
import { getAppProviderState } from "@/app/[locale]/get-app-provider-state";
import { Providers } from "@/app/[locale]/providers";
import { Link } from "@/common/translation/navigation";

export default async function RootNotFound() {
  const [locale, tErrors, tCommon] = await Promise.all([
    getLocale(),
    getTranslations("errors"),
    getTranslations("common"),
  ]);
  const providerState = await getAppProviderState(locale);

  return (
    <Providers {...providerState}>
      <main data-testid="root-not-found-page">
        <Text as="h1" testId="root-not-found-page-title">
          {tErrors("notFound")}
        </Text>
        <Text as="p" testId="root-not-found-page-description">
          {tErrors("notFoundDescription")}
        </Text>
        <div>
          <Link href="/">
            <Button color="secondary" size="md" testId="root-not-found-back-home">
              {tCommon("back")}
            </Button>
          </Link>
        </div>
      </main>
    </Providers>
  );
}
