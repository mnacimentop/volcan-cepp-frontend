import { Button, Text } from "@pormeldev/axis-design-system";
import { getTranslations } from "next-intl/server";
import { Link } from "@/common/translation/navigation";

export default async function LocaleNotFound() {
  const [tErrors, tCommon] = await Promise.all([
    getTranslations("errors"),
    getTranslations("common"),
  ]);

  return (
    <main data-testid="not-found-page">
      <Text as="h1" testId="not-found-page-title">
        {tErrors("notFound")}
      </Text>
      <Text as="p" testId="not-found-page-description">
        {tErrors("notFoundDescription")}
      </Text>
      <div>
        <Link href="/">
          <Button color="secondary" size="md" testId="not-found-back-home">
            {tCommon("back")}
          </Button>
        </Link>
      </div>
    </main>
  );
}
