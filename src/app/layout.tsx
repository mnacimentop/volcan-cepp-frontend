import "@pormeldev/axis-design-system/styles.css";
import "@pormeldev/axis-design-system/fonts.css";
import { axisFont } from "@pormeldev/axis-design-system/next-font";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axis Frontend Template",
  description: "Template de referencia para frontend moderno con Next.js 16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={axisFont.variable} data-axis-theme="default" lang="es">
      <body>{children}</body>
    </html>
  );
}
