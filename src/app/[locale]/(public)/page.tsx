import { Text } from "@pormeldev/axis-design-system";
import { AxisLogoHorizontal } from "@pormeldev/axis-design-system/icons";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "./locale-switcher";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ locale: string }>;
};

const documentationLinks = [
  {
    href: "https://axis-docs-frontend.internal.pormel.tech/",
    key: "frontend",
  },
  {
    href: "https://axis-composable-design-system.internal.pormel.tech/?path=/docs/platform-components-axis-design-system--docs",
    key: "designSystem",
  },
] as const;

export default async function HomePage({ params }: Readonly<Props>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("templateHome");

  return (
    <main className={styles.page}>
      <LocaleSwitcher locale={locale} />
      <section className={styles.content} aria-labelledby="template-home-title">
        <div className={styles.hero}>
          <Text as="span" className={styles.eyebrow} testId="template-home-eyebrow">
            {t("eyebrow")}
          </Text>
          <div className={styles.logoFrame}>
            <AxisLogoHorizontal alt={t("logoAlt")} className={styles.logo} size="160px" />
          </div>
          <Text
            as="h1"
            className={styles.title}
            id="template-home-title"
            testId="template-home-title"
          >
            {t("title")}
          </Text>
          <Text as="p" className={styles.description} testId="template-home-description">
            {t("description")}
          </Text>
        </div>

        <section className={styles.documentation} aria-labelledby="template-home-docs-title">
          <Text as="h2" className={styles.documentationTitle} testId="template-home-docs-title">
            {t("documentation.title")}
          </Text>
          <Text
            as="p"
            className={styles.documentationDescription}
            testId="template-home-docs-description"
          >
            {t("documentation.description")}
          </Text>
          <div className={styles.documentationLinks}>
            {documentationLinks.map(({ href, key }) => (
              <a
                className={styles.documentationLink}
                href={href}
                key={key}
                rel="noreferrer"
                target="_blank"
              >
                <span className={styles.cardContent}>
                  <Text
                    as="span"
                    className={styles.linkLabel}
                    testId={`template-home-docs-${key}-label`}
                  >
                    {t(`documentation.${key}.label`)}
                  </Text>
                  <Text
                    as="span"
                    className={styles.linkDescription}
                    testId={`template-home-docs-${key}-description`}
                  >
                    {t(`documentation.${key}.description`)}
                  </Text>
                </span>
                <span className={styles.linkAction}>
                  {t("documentation.open")}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
