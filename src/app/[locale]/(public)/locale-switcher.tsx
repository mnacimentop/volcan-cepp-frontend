"use client";

import { Button } from "@pormeldev/axis-design-system";
import { useTranslations } from "next-intl";
import { Link } from "@/common/translation/navigation-client";
import styles from "./page.module.css";

type Props = {
  locale: string;
};

export function LocaleSwitcher({ locale }: Readonly<Props>) {
  const t = useTranslations("templateHome.locale");
  const alternateLocale = locale === "es" ? "en" : "es";

  return (
    <nav aria-label={t("label")} className={styles.localeSwitcher}>
      <Button
        color="secondary"
        href="/"
        linkComponent={Link}
        locale={alternateLocale}
        size="sm"
        testId="template-home-locale-switcher"
      >
        {t(`switchTo.${alternateLocale}`)}
      </Button>
    </nav>
  );
}
