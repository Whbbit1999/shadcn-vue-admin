# Testing Strategy

## Current State

- Vitest is configured in `vite.config.ts`. Existing tests cover utilities, stores, API behavior, configuration parsing, error pages, and shared table behavior.
- Use `pnpm test` for watch mode, `pnpm test:run` for a single run, and `pnpm test:coverage` for coverage reports.
- Component tests use `@vue/test-utils` with `// @vitest-environment happy-dom` where a DOM is required.
- CI runs lint, build, and test coverage for pull requests with non-Markdown changes. No coverage threshold is configured.
- Run `pnpm build` as well: it checks TypeScript and the production bundle.

## Policy (Strong Constraints)

- If you change logic in any of the following areas:
  - `src/lib/**`, `src/utils/**`
  - `src/composables/**`
  - `src/services/**`
  - `src/router/**`
  - `src/stores/**`
  - With a test runner available: automated tests are required in the same change, and you must run the relevant test command.
  - Without a test runner: tests are optional but strongly recommended; you must include “Testing Notes” in the PR/commit description explaining risk and manual/alternative checks.
- Pure UI layout/styling changes may skip tests, but must still pass `pnpm build`.

## Agent Checklist (When Changing Code)

1. Run `pnpm lint:fix`.
2. Run `pnpm build` to catch TypeScript + build-time issues.
3. If a test script exists (e.g. `test`, `test:unit`, `test:e2e`), run the relevant command(s).
4. For core logic changes, add/adjust tests (see Policy).

## What To Test

- Pure logic/utils: unit tests (fast, deterministic).
- Composables: unit tests with mocked dependencies.
- UI components/pages: component tests only for critical interactions; prefer testing behavior over implementation details.

## Tooling

- Unit/component: Vitest + @vue/test-utils (installed).
- E2E: no runner is configured. Add Playwright only when end-to-end coverage is needed.
