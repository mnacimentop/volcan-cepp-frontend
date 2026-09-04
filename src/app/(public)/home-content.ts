export const homeContent = {
  logoAlt: "Axis",
  eyebrow: "Template de referencia",
  title: "Inicia tu app Axis",
  description:
    "Una base con Next.js, Design System y tooling común para construir tu primera feature.",
  documentation: {
    title: "Documentación Axis",
    description: "Dos puntos de partida para construir con una base consistente.",
    open: "Abrir documentación",
    links: [
      {
        key: "frontend",
        href: "https://axis-docs-frontend.internal.pormel.tech/",
        label: "Axis Frontend Docs",
        description: "Recorré la guía para crear y estructurar una aplicación Axis.",
      },
      {
        key: "designSystem",
        href: "https://axis-composable-design-system.internal.pormel.tech/?path=/docs/platform-components-axis-design-system--docs",
        label: "Axis Design System",
        description: "Consultá componentes, tokens y patrones de interfaz.",
      },
    ],
  },
} as const;
