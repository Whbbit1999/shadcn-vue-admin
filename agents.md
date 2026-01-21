# agents.md

## Commands

- `pnpm dev` # Start dev server
- `pnpm build` # Typecheck + build (CI-like sanity check)
- `pnpm lint:fix` # Auto-fix linting issues

Run `pnpm lint:fix` after code changes.

If the project has tests configured (e.g. a `test` script), run them as well.

## Strong Constraints (Required)

- Always run `pnpm build` for any non-trivial change (not just UI text).
- If you modify core logic (e.g. `src/lib/**`, `src/utils/**`, `src/composables/**`, `src/services/**`, `src/router/**`, `src/stores/**`):
  - If the repo has a test runner/script (e.g. `pnpm test` / `pnpm test:unit`): add/adjust automated tests in the same change and run the tests.
  - If the repo still has no test runner:
    - Tests are optional but strongly recommended.
    - Add “Testing Notes” in the PR/commit description explaining the risk and the manual/alternative checks performed.
    - Consider adding a minimal unit test setup (recommended) once the team decides to introduce testing.

## Stack

- vue, shadcn-vue, tailwindcss, vee-validate, typescript, zod

## Structure

- `src/` - Vue application
- `vite.config.ts` - vite config

## Further Reading

- `.agents/SYSTEM_KNOWLEDGE_MAP.md`
- `.agents/testing-strategy.md`
