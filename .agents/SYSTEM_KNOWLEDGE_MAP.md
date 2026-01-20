# System Knowledge Map (for agents)

> This is a “navigation index”. It only keeps the high-level structure and key entry files so AI can locate things quickly.

## Project Overview

- Stack: Vue 3 + Vite + TypeScript + TailwindCSS
- Routing: `unplugin-vue-router` (based on `src/pages`) + `vite-plugin-vue-layouts`
- State: Pinia (with persistedstate)
- Data: Axios + @tanstack/vue-query
- Forms: vee-validate + zod
- UI: shadcn-vue / reka-ui / lucide-vue-next / vue-sonner

## Startup Flow

- `index.html`
- `src/main.ts`: creates the app, registers plugins, imports global CSS, loads `src/utils/env`
- `src/App.vue`: `<router-view />` + `<Suspense>`, initializes `useSystemTheme()`

## Build / Generation (Vite)

- `vite.config.ts`
  - Alias: `@` -> `src/`
  - Route generation: `unplugin-vue-router` (types: `src/types/typed-router.d.ts`)
  - Layouts: `vite-plugin-vue-layouts` (default: `default`)
  - Auto-import: `src/composables` / `src/constants` / `src/stores` (types: `src/types/auto-import.d.ts`)
  - Components: `src/components` (types: `src/types/auto-import-components.d.ts`)

## Routing & Layouts

- Pages (route source): `src/pages/**`
- Router (assembly / scroll behavior / HMR): `src/router/index.ts`
- Guards: `src/router/guard/*` (includes auth + nprogress)
- Layouts: `src/layouts/*.vue` (default / blank / marketing)

In page files you can use `<route lang="yaml">` to define meta (commonly: layout/auth). Example YAML:

```yaml
meta:
  # layout can be: false | blank | marketing
  layout: blank
  auth: true
```

## State & Theme

- Stores: `src/stores/*` (`auth.ts`, `theme.ts`)
- Theme: `src/composables/use-system-theme.ts` + `src/assets/themes.css`
- Dark/Light/System: `src/components/toggle-theme.vue`

## Data Fetching / API

- Axios: `src/composables/use-axios.ts`
- Vue Query plugin: `src/plugins/tanstack-vue-query/setup.ts`
- API modules: `src/services/api/*.api.ts`
- Shared response types: `src/services/types/response.type.ts`

## Environment Variables

When adding environment variables, make sure to validate/types them in `src/utils/env.ts`.

## Third-party Plugin Setup

Plugin initialization entry: `src/plugins/index.ts`

1. When introducing a third-party plugin that needs configuration, put the setup in `src/plugins/[plugin-name]/setup.ts`.
2. Import/register it from `src/plugins/index.ts`.

## Form Validation

- Validators: `src/pages/**/validators/*.validator.ts` (zod)
- Forms: `src/pages/**/components/*-form.vue` (commonly: `toTypedSchema` + `useForm`)

## UI Component Directories

- Base UI: `src/components/ui/**`
- Layout components: `src/components/global-layout/**`
- Sidebar: `src/components/app-sidebar/**`
- Command palette: `src/components/command-menu-panel/**`

## Page / Module Directory Convention

> Routes are generated automatically from the file structure.

- Pages: `src/pages/**/*.vue`
- Page components: `src/pages/**/components/**/*.vue`
- Validators: `src/pages/**/validators/*.validator.ts`
- For data-display pages, table configuration should live in: `src/pages/**/data/**`

## Key Conventions

- Routing is file-based: do NOT hand-edit route tables; add/rename/remove pages under `src/pages/**`.
- Prefer `<route lang="yaml">` meta over ad-hoc logic (commonly: `meta.layout`, `meta.auth`).
- Keep env vars strictly typed/validated in `src/utils/env.ts` before use.
- Prefer `@/` (alias to `src/`) imports to avoid brittle relative paths.

## Common Tasks (Where to Change)

- Add a new page/route: create `src/pages/<name>.vue` (or `src/pages/<name>/index.vue`) + optional `<route lang="yaml">` meta.
- Add/modify a layout: edit `src/layouts/*.vue`, then set `meta.layout` in the page.
- Add a plugin: create `src/plugins/<plugin>/setup.ts`, then register it in `src/plugins/index.ts`.
- Add an API module: create `src/services/api/*.api.ts`; put shared request/response types in `src/services/types/*` or `src/services/api/types/*`.
- Add data fetching: use Axios (`src/composables/use-axios.ts`) + Vue Query (setup: `src/plugins/tanstack-vue-query/setup.ts`).
- Add a form: define a zod validator in `src/pages/**/validators/*.validator.ts`, then use it from `src/pages/**/components/*-form.vue`.
- Add a store: create `src/stores/*.ts` (Pinia; persistedstate is enabled).

## Common Pitfalls

- Auto-generated types/routes: when pages change, TypeScript/IDE may need a restart to pick up updated generated types (e.g. `src/types/typed-router.d.ts`).
- Auto-imported symbols: composables/constants/stores are auto-imported; name collisions can silently change which symbol you get.
- Layout meta values: ensure `meta.layout` matches an actual layout filename (and understand what `layout: false` does in this project).
- Env vars: Vite uses `import.meta.env`; do not bypass `src/utils/env.ts` validation.

## Quick Verification

- Dev: `pnpm dev`
- Lint: `pnpm lint:fix`
- Build: `pnpm build`
