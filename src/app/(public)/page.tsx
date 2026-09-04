import { Text } from "@pormeldev/axis-design-system";
import { AxisLogoHorizontal } from "@pormeldev/axis-design-system/icons";
import { homeContent } from "./home-content";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="template-home-title">
        <div className={styles.hero}>
          <Text as="span" className={styles.eyebrow} testId="template-home-eyebrow">
            {homeContent.eyebrow}
          </Text>
          <div className={styles.logoFrame}>
            <AxisLogoHorizontal alt={homeContent.logoAlt} className={styles.logo} size="160px" />
          </div>
          <Text
            as="h1"
            className={styles.title}
            id="template-home-title"
            testId="template-home-title"
          >
            {homeContent.title}
          </Text>
          <Text as="p" className={styles.description} testId="template-home-description">
            {homeContent.description}
          </Text>
        </div>

        <section className={styles.documentation} aria-labelledby="template-home-docs-title">
          <Text as="h2" className={styles.documentationTitle} testId="template-home-docs-title">
            {homeContent.documentation.title}
          </Text>
          <Text
            as="p"
            className={styles.documentationDescription}
            testId="template-home-docs-description"
          >
            {homeContent.documentation.description}
          </Text>
          <div className={styles.documentationLinks}>
            {homeContent.documentation.links.map(({ href, key, label, description }) => (
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
                    {label}
                  </Text>
                  <Text
                    as="span"
                    className={styles.linkDescription}
                    testId={`template-home-docs-${key}-description`}
                  >
                    {description}
                  </Text>
                </span>
                <span className={styles.linkAction}>
                  {homeContent.documentation.open}
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
