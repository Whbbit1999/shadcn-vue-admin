---
name: shadcn-vue-admin
description: Build and maintain the shadcn-vue-admin Vue 3 + Vite + TypeScript admin dashboard with shadcn-vue, Tailwind, Pinia, Vue Router, i18n, and TanStack Query. Use for UI/layout changes, page additions, routing updates, theme/auth work, and component integration in this repo.
license: MIT
metadata:
  repository: Whbbit1999/shadcn-vue-admin
  package-manager: pnpm
  framework: vue
  language: typescript
---

# Purpose and scope

Maintain this Vue 3 admin dashboard repository: pages and layouts, component integration, routing/auth, theming and i18n, data tables, and form validation.

# Codebase map

- App entry: `src/main.ts`, `src/App.vue`
- Routing: `src/router/`
- Layouts and pages: `src/layouts/`, `src/pages/`
- Components: `src/components/` (including shadcn-vue style UI)
- State: `src/stores/`
- Composables: `src/composables/`
- Utils and constants: `src/utils/`, `src/lib/`, `src/constants/`
- Plugins: `src/plugins/`

# References

- System knowledge map: [references/SYSTEM_KNOWLEDGE_MAP.md](references/SYSTEM_KNOWLEDGE_MAP.md)
- Testing strategy: [references/testing-strategy.md](references/testing-strategy.md)

# Standard workflow

1. Read existing implementations in the target directory and reuse established patterns and styles.
2. Prefer existing shadcn-vue components and shared utilities to avoid duplication.
3. Only change public APIs when necessary; avoid large-scale formatting unrelated code.

# Commands and checks

- Dev server: `pnpm dev`
- Build (CI-like check): `pnpm build`
- Lint fix: `pnpm lint:fix`

Requirements:

- Run `pnpm build` for any non-copy-only change.
- Run `pnpm lint:fix` after code changes.
- If you modify core logic (`src/lib/**`, `src/utils/**`, `src/composables/**`, `src/services/**`, `src/router/**`, `src/stores/**`):
  - If test scripts exist (e.g. `pnpm test`/`pnpm test:unit`), add/update tests and run them.
  - If no test scripts exist, tests are optional but recommended; include “Testing Notes” in the change description.

# Design and implementation conventions

- Use Vue 3 Composition API with TypeScript.
- Prefer vee-validate + zod for form validation.
- Follow existing theming strategy in `src/assets/` and `src/stores/theme.ts`.
- Follow the existing structure for i18n in `src/plugins/i18n/`.

# Common task guides

## Add a page

1. Create a page component under `src/pages/`.
2. Register routing/menu via `src/router/` if needed.
3. Use existing layouts and shared components for consistent spacing and typography.

## Add a component

1. Reuse `src/components/ui/` and existing shadcn-vue components first.
2. If it should be shared, place it under `src/components/` to avoid page-level duplication.

## Update theme/styles

1. Prefer Tailwind and theme files in `src/assets/`.
2. Avoid heavy inline styles; keep components maintainable.

# Output requirements

After changes, provide a concise summary and list any commands run (if any).
