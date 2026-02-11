# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 admin dashboard using Shadcn-vue components, built with TypeScript, Vite, and Tailwind CSS. The project uses file-based routing, auto-imports, and TanStack Vue Query for data fetching.

## Commands

### Development

```bash
pnpm dev          # Start dev server (Vite)
pnpm build        # Build for production (runs vue-tsc -b && vite build)
pnpm preview      # Preview production build locally
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
```

### Package Manager

- Uses `pnpm@10.28.2` as the package manager
- Use `pnpm` for all package operations

## Architecture

### Auto-Import System

This project heavily uses `unplugin-auto-import` and `unplugin-vue-components`:

1. **Auto-imported Vue APIs**: `ref`, `computed`, `watch`, `onMounted`, etc. are available without explicit imports
2. **Auto-imported composables**: All files in `src/composables/**/*.ts` are auto-imported
3. **Auto-imported stores**: All files in `src/stores/**/*.ts` are auto-imported
4. **Auto-imported constants**: All files in `src/constants/**/*.ts` are auto-imported
5. **Auto-imported components**: All files in `src/components/**/*.vue` are available with directory-based namespace

Do not add manual imports for these - they are handled by the build system. Check `src/types/auto-import.d.ts` and `src/types/auto-import-components.d.ts` for available auto-imports.

### File-Based Routing

Routes are auto-generated from `src/pages/` using `unplugin-vue-router`:

- Route structure mirrors file structure in `src/pages/`
- Use `definePage` in `.vue` files to add meta properties (e.g., `auth: true` for protected routes)
- Layouts are in `src/layouts/` and applied automatically based on route configuration
- Route guards are in `src/router/guard/` - currently implements auth guard that redirects unauthenticated users to `/auth/sign-in`

Route meta interface is extended in `src/types/vue-router-meta.d.ts`:

```typescript
auth?: boolean  // If true, requires user login
```

### Plugin System

Plugins are initialized in `src/plugins/index.ts` in a specific order:

1. Dayjs (date library)
2. NProgress (loading indicator)
3. AutoAnimate (animations)
4. TanStack Vue Query (data fetching)
5. I18n (internationalization)
6. Pinia (state management)
7. Router (routing)

### State Management

Pinia stores in `src/stores/` use the composition API style and are persisted with `pinia-plugin-persistedstate`:

- `auth.ts`: Manages authentication state (`isLogin`, `token`, `username`)
- `theme.ts`: Manages theme preferences (`theme`, `radius`, `contentLayout`)

### Data Fetching

TanStack Vue Query is configured with a 5-minute stale time. Create axios instances using the `useAxios()` composable which:

- Configures base URL from `VITE_SERVER_API_URL` + `VITE_SERVER_API_PREFIX`
- Sets timeout from `VITE_SERVER_API_TIMEOUT`
- Adds Bearer token from auth store to requests
- Handles 401 responses by clearing auth and redirecting to sign-in

### Internationalization (i18n)

Vue I18n is configured with locale files in `src/plugins/i18n/`:

- `en.json` - English translations
- `zh.json` - Chinese translations
- Default locale: `en`
- Fallback locale: `en`

Use the `$t()` function in templates for translations.

### Component Structure

```
src/components/
├── ui/                    # Shadcn-vue UI components (auto-imported)
├── app-sidebar/           # Sidebar navigation components
├── data-table/            # Reusable data table with filtering/pagination
├── global-layout/         # Layout components (BasicPage, TwoCol, etc.)
├── command-menu-panel/    # Command palette components
├── custom-theme/          # Theme customization components
└── ...
```

UI components from `src/components/ui/` are ignored by ESLint and automatically available.

### Page Structure

```
src/pages/
├── [...path].vue          # Catch-all 404 route
├── auth/                  # Authentication pages (sign-in)
├── errors/                # Error pages (401, 403, 404, 500, 503)
├── settings/             # Settings pages with sub-sections
├── raas/                 # RaaS dashboard pages
└── index.vue             # Home page
```

### Environment Configuration

Environment variables:

- `VITE_SERVER_API_URL` - Backend API base URL
- `VITE_SERVER_API_PREFIX` - API path prefix
- `VITE_SERVER_API_TIMEOUT` - Request timeout in ms

Environment files: `.env`, `.env.production`, `.env.example`, `.env.production.example`

## Important Notes

- The build process removes `console.log` calls and `debugger` statements via esbuild configuration
- ESLint config uses `@antfu/eslint-config` with TypeScript, Vue, and formatting rules
- All stores use the persisted plugin - state persists to localStorage
- Auth tokens are automatically added to axios requests via interceptor
- 401 responses automatically clear auth and redirect to `/auth/sign-in`
