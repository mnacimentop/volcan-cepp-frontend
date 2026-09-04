import { expect, test } from "@playwright/test";

test.use({ locale: "es-ES" });

test("renders the Spanish Axis entry point and documentation links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Inicia tu app Axis" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Documentación Axis" })).toBeVisible();

  await expect(page.getByRole("link", { name: /Axis Frontend Docs/ })).toHaveAttribute(
    "href",
    "https://axis-docs-frontend.internal.pormel.tech/",
  );
  await expect(page.getByRole("link", { name: /Axis Design System/ })).toHaveAttribute(
    "href",
    "https://axis-composable-design-system.internal.pormel.tech/?path=/docs/platform-components-axis-design-system--docs",
  );
});
