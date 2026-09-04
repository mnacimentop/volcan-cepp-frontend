# syntax=docker/dockerfile:1.7

FROM node:24.19.0-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable

FROM base AS dependencies

COPY package.json pnpm-lock.yaml .npmrc ./

# The token is configured only for this command, then removed before the layer
# is committed. It is never copied into a later stage or the runtime image.
RUN --mount=type=secret,id=github_pat \
    set -eu; \
    pnpm config set --location=user //npm.pkg.github.com/:_authToken "$(cat /run/secrets/github_pat)"; \
    HUSKY=0 pnpm install --frozen-lockfile; \
    pnpm config delete --location=user //npm.pkg.github.com/:_authToken

FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . ./

# Keep the runtime COPY stable even when the application has no public assets.
RUN mkdir -p public && pnpm build

FROM node:24.19.0-bookworm-slim AS runner

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "server.js"]
