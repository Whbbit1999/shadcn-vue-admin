# Testing Strategy

## Current State

- This repo currently has no dedicated test runner configured (no `pnpm test` script in `package.json`).
- For now, treat `pnpm build` (typecheck + Vite build) as the primary safety net.

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

## What To Test (If Adding Tests Later)

- Pure logic/utils: unit tests (fast, deterministic).
- Composables: unit tests with mocked dependencies.
- UI components/pages: component tests only for critical interactions; prefer testing behavior over implementation details.

## Recommended Tooling (Optional)

- Unit/component: Vitest + @vue/test-utils
- E2E (only if needed): Playwright
