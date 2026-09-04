# Axis Frontend Template

Base para una aplicación Axis con Next.js 16, React 19, TypeScript y Axis Design System.

## Incluye

- App Router con contenido en español fijo.
- Axis Design System, fuentes y una home de bienvenida.
- Tooling común en `src/common` para configuración, HTTP, errores, traducciones y UI compartida.
- Biome, Jest, Playwright, TypeScript 7, Husky y Commitlint.

## Requisitos

- Node.js 24.19.0 LTS.
- pnpm 11.20.0 o superior.
- Un token de GitHub Packages con acceso a `@pormeldev` para instalar las librerías privadas de Axis.

pnpm 11 no lee tokens definidos en el `.npmrc` versionado del proyecto. Configurá el token una sola vez en tu perfil de usuario:

```powershell
pnpm config set --location=user //npm.pkg.github.com/:_authToken <GITHUB_PAT>
```

## Primeros pasos

```bash
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:3000`.

## Configuración opcional de HTTP

Copiá `.env.example` a `.env` antes de conectar una feature con un backend. `FETCH_TIMEOUT_MS` se lee solo en el servidor desde `src/common/config`.

## Validación

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Documentación

- [Axis Frontend Docs](https://axis-docs-frontend.internal.pormel.tech/)
- [Axis Design System](https://axis-composable-design-system.internal.pormel.tech/?path=/docs/platform-components-axis-design-system--docs)
- [Axis HTTP Client Kit](https://axis-composable-design-system.internal.pormel.tech/?path=/docs/platform-http-axis-client-kit--docs)
