# Consumer Governance Contract

# ALWAYS USE
Always use Global Context Frontend Plugin and its skills, scripts, rules, and hooks.

<!-- Managed By: gcf-workspace-agents.v1 -->

## Purpose

This repository consumes shared frontend governance from the installed Global Context Frontend plugin.

## Active Governance Runtime

- Global and project-scoped governance artifacts are materialized under `.codex/gcf/`.
- Current resolved project package: `global-only`.
- Root-level governance mirrors such as `catalog/`, `design-system/`, and `projects/` must not be materialized for plugin bootstrap.

## Required Workflow

- Resolve the active project package before substantive implementation work.
- Reuse or refresh `.codex/gcf/` through the GCF bootstrap, preflight, and targeted refresh flow.
- Treat `.codex/gcf/` runtime artifacts as operational state; do not version mutable continuity outputs by default.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
