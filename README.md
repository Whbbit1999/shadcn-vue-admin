# Shadcn Vue Admin

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

[中文](./README-CN.md)

Forked from [shadcn-admin](https://github.com/satnaing/shadcn-admin)

Admin Dashboard UI crafted with Shadcn-vue, Vue3 and Vite. Built with responsiveness and accessibility in mind.

![cover](public/shadcn-vue-admin.png)

This is not a starter project (template) though. More components will be added later.

## Features
- [x] Light/Dark Mode
- [x] Global Search Command
- [x] shadcn-ui sidebar
- [x] 8+ pages
- [x] some custom components
- [x] auto generate routes

## Tech Stack
ui:
  - [inspira-ui](https://inspira-ui.com/components/box-reveal)
  - [shadcn-vue](https://www.shadcn-vue.com)

Build Tool:
  - [Vite](https://cn.vitejs.dev/)

State Management:
  - [pinia](https://pinia.vuejs.org/api/pinia/)
  - [persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/limitations.html)

Styling:
  - [Tailwind CSS](https://tailwindcss.com/)

Unplugins:
  - [Auto Import](https://github.com/antfu/unplugin-auto-import)
  - [Components](https://github.com/antfu/unplugin-vue-components)
  - [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
  - [Vite Plugin Vue Layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)
  - [Vite Plugin Vue Devtools](https://github.com/webfansplz/vite-plugin-vue-devtools)

Icons:
  - [Lucide](https://lucide.dev/)

Linting:
  - [ESLint](https://eslint.org/)
  - [antfu/eslint-config](https://github.com/antfu/eslint-config)

## Run locally
clone the project
```bash
git clone https://github.com/Whbbit1999/shadcn-vue-admin.git
```

Go to the project directory
```bash
cd shadcn-vue-admin
```

Install dependencies
```bash
pnpm install
```

Start the development server
```bash
pnpm dev
```

## Author
Created by [Whbbit](https://github.com/Whbbit1999), Design by [shadcn-admin](https://github.com/satnaing/shadcn-admin)

## Tips

If you need to change the website style, you can use the preset styles provided by [tweakcn](https://tweakcn.com/editor/theme). You only need to copy the css variables provided by tweakcn to `index.css` and change the `:root` `:dark` and `@theme inline` parts.

## License
[MIT](https://github.com/Whbbit1999/shadcn-vue-admin/blob/main/LICENSE)
