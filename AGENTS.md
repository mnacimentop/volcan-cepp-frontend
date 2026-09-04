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

