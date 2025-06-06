# Shadcn Vue Admin

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

Forked from [shadcn-admin](https://github.com/satnaing/shadcn-admin)

管理仪表板 UI 采用 Shadcn-vue、Vue3 和 Vite 精心打造。构建时充分考虑了响应能力和可访问性。

![cover](public/shadcn-vue-admin.png)

这是一个起始（模板）项目，后续会增加更多组件。

## 特性
- [x] 亮色|暗色模式
- [x] 全局搜索命令
- [x] shadcn-ui 侧边栏
- [x] 8+ 页面
- [x] 精美的自定义组件
- [x] 自动生成路由

## 技术栈
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

Charts:
  - [vue-chrts](https://github.com/dennisadriaans/vue-chrts)
> 如果您使用 tailwindcss v4，shadcn-vue charts 已被标记为 'Legacy'。我们现在使用这个库来替代它。

## 本地运行
克隆项目至本地
```bash
git clone https://github.com/Whbbit1999/shadcn-vue-admin.git
```

进入项目所在目录
```bash
cd shadcn-vue-admin
```

安装依赖
```bash
pnpm install
```

启动项目
```bash
pnpm dev
```

## Tips

如果您需要更改网站样式，可以使用[tweakcn](https://tweakcn.com/editor/theme)网站提供的预设样式。你只需要将 tweakcn 提供的 css 样式 复制到 `index.css` 中，改动 `:root` `:dark` 和 `@theme inline` 部分即可。

## 作者
由 [Whbbit](https://github.com/Whbbit1999)创建, 设计来自 [shadcn-admin](https://github.com/satnaing/shadcn-admin)

## 许可证
[MIT](https://github.com/Whbbit1999/shadcn-vue-admin/blob/main/LICENSE)
