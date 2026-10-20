# Shadcn Vue Admin

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Whbbit1999/shadcn-vue-admin/blob/main/LICENSE)
[![Vue 3.5+](https://img.shields.io/badge/Vue-3.5+-brightgreen.svg?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-4f30e8.svg?logo=vite)](https://vitejs.dev/)
[![pnpm 11](https://img.shields.io/badge/pnpm-11-orange.svg?logo=pnpm)](https://pnpm.io/)
[![TypeScript 6.0+](https://img.shields.io/badge/TypeScript-6.0+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)

[简体中文](./README-CN.md) | English

A frontend UI template built with **shadcn-vue**, **Vue 3** and **Vite**, bringing together common layouts, components and example pages that you can customize and extend.
Adapted from [shadcn-admin](https://github.com/satnaing/shadcn-admin) for Vue.

[Live Demo](https://shadcn-vue-admin.netlify.app/)

![cover](.github/assets/shadcn-vue-admin.png)

> This repository provides frontend examples. Login is mocked, and pages such as Tasks use local sample data. Connect your own authentication and business APIs before using it in production.

## ✨ Key Features

- ✅ Light, dark and system appearance, with persistent theme settings
- ✅ Global search command palette
- ✅ Sidebar navigation built with shadcn-vue components
- ✅ Example pages for dashboards, tasks, users, settings, authentication and errors
- ✅ Custom component library with shadcn-vue extensions
- ✅ Auto-generated routing system (based on file structure)
- ✅ English and Simplified Chinese locale resources with vue-i18n (some page copy remains hardcoded)
- ✅ Form validation with tanstack/vue-form + Zod
- ✅ Reusable data tables with TanStack Table, query/mutation examples with TanStack Query, and charts with Unovis
- ✅ Animation support (AutoAnimate, Motion-V, TW Animate CSS)

## 🛠️ Tech Stack & Version Constraints

| Category             | Tools & Libraries (Major Versions)                                                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core Framework       | [Vue 3.5+](https://vuejs.org/), [TypeScript 6+](https://www.typescriptlang.org/)                                                                           |
| UI Components        | [shadcn-vue](https://www.shadcn-vue.com), [reka-ui 2+](https://www.reka-ui.com/), [@lucide/vue](https://lucide.dev/)                                       |
| Build Tool           | [Vite 8+](https://vitejs.dev/), [@vitejs/plugin-vue 6+](https://github.com/vitejs/vite-plugin-vue)                                                         |
| State Management     | [Pinia 4+](https://pinia.vuejs.org/), [pinia-plugin-persistedstate 4+](https://prazdevs.github.io/pinia-plugin-persistedstate/)                            |
| Routing              | [vue-router 5+](https://router.vuejs.org/), [vite-plugin-vue-layouts 0.11+](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)                      |
| Styling              | [Tailwind CSS 4+](https://tailwindcss.com/), [tw-animate-css 1+](https://github.com/Wombosvideo/tw-animate-css)                                            |
| Data Handling        | [TanStack Vue Query 5+](https://tanstack.com/query/latest), [TanStack Vue Table 9+](https://tanstack.com/table/latest)                                     |
| Form Validation      | [TanStack Vue Form](https://tanstack.com/form/latest/docs/overview), [Zod 4+](https://zod.dev/)                                                            |
| Animation            | [@formkit/auto-animate 0.10+](https://auto-animate.formkit.com/), [motion-v 2+](https://motion-v.vercel.app/)                                              |
| Internationalization | [vue-i18n 11+](https://vue-i18n.intlify.dev/)                                                                                                              |
| HTTP Client          | [ofetch](https://github.com/unjs/ofetch)                                                                                                                   |
| Linting & Formatting | [ESLint 10+](https://eslint.org/), [@antfu/eslint-config 9+](https://github.com/antfu/eslint-config)                                                       |
| Auto Import          | [unplugin-auto-import 21+](https://github.com/antfu/unplugin-auto-import), [unplugin-vue-components 32+](https://github.com/antfu/unplugin-vue-components) |

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22.15, as declared in `package.json`; CI uses Node.js 22.
- Use the pnpm version specified by `packageManager` in `package.json` (currently **11.28.5**).
- TypeScript is installed as a project dependency; no global installation is needed.

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Whbbit1999/shadcn-vue-admin.git
   ```

2. Navigate to project directory

   ```bash
   cd shadcn-vue-admin
   ```

3. Install dependencies

   ```bash
   pnpm install
   ```

4. Start development server

   ```bash
   pnpm dev
   ```

### Available Scripts

```bash
pnpm dev             # Start development server
pnpm build           # Build for production (vue-tsc + vite build)
pnpm build:analyze   # Build with bundle visualizer (ANALYZE=true)
pnpm preview         # Preview production build
pnpm lint            # ESLint check
pnpm lint:fix        # Auto fix lint issues
pnpm test            # Run unit tests in watch mode
pnpm test:run        # Run unit tests once
pnpm test:coverage   # Run unit tests with coverage
pnpm release         # Bump version with bumpp
```

## 📖 Advanced Guides

### Dependency Maintenance

- Dependency ranges are declared in `package.json`; `pnpm-lock.yaml` records the resolved versions. CI installs with `pnpm install --frozen-lockfile`.
- Git hooks use `simple-git-hooks`: pre-commit runs `nano-staged` to fix lint issues in staged files, and pre-push runs `pnpm build`.
- Pull request CI runs lint, build and test coverage checks for changes beyond Markdown files.

### Theme Customization

Use [tweakcn](https://tweakcn.com/editor/theme) as a starting point for custom themes. Update the base CSS variables in `src/assets/index.css` under `:root` and `.dark`, and adjust the `@theme inline` mappings when needed. The selectable color themes have their own overrides in `src/assets/themes.css`; update those too when customizing a selectable theme.

### Layout Customization

For pages in `pages/errors/` and `pages/auth/` that you don’t want to use the default layout:

Create a same-name file in `pages/`:
`src/pages/errors.vue`
`src/pages/auth.vue`

```vue
<template>
  <router-view />
</template>

<route lang="yml">
meta:
  layout: false
</route>
```

The project already uses this pattern in `src/pages/auth.vue` and `src/pages/errors.vue`. For a new directory, add an `index.vue` if its base path should redirect to a child page:

```vue
<script lang="ts" setup>
const router = useRouter()
router.replace('/errors/404')
</script>
```

### API Configuration

When connecting a backend, use `.env.example` as a reference for your local environment configuration:

- `VITE_SERVER_API_URL`: backend origin.
- `VITE_SERVER_API_PREFIX`: API path prefix (defaults to `/api`).
- `VITE_SERVER_API_TIMEOUT`: request timeout in milliseconds (defaults to `5000`).

`src/lib/api-client.ts` provides the shared ofetch client, and `src/services/api/` contains API examples. The Tasks page currently uses `src/pages/tasks/data/tasks.json`; the task API examples are not wired into that page.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/Whbbit1999/shadcn-vue-admin/blob/main/LICENSE) file for details.

## 🤝 Credits

- **Developer**: [Whbbit1999](https://github.com/Whbbit1999)
- **Original Design**: [shadcn-admin](https://github.com/satnaing/shadcn-admin)
