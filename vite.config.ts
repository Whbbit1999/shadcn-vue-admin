import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Component from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'

const RouteGenerateExclude = ['**/components/**', '**/layouts/**', '**/data/**', '**/types/**']

export default defineConfig({
  plugins: [
    VueRouter({
      exclude: RouteGenerateExclude,
      dts: 'src/types/typed-router.d.ts', // 类型提示文件
    }),
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    visualizer({ gzipSize: true, brotliSize: true }),
    Layouts({
      defaultLayout: 'default',
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        VueRouterAutoImports,
      ], // 自动加载 vue,vue-router api
      dirs: [
        'src/composables/**/*.ts',
        'src/enum/**/*.ts',
        'src/store/**/*.ts',
      ], // 自动加载配置里的文件
      defaultExportByFilename: true, // 包含文件夹名称，避免命名冲突
      dts: 'src/types/auto-import.d.ts', // 类型提示文件
    }),
    Component({
      dirs: [
        'src/components',
      ],
      collapseSamePrefixes: true,
      directoryAsNamespace: true, // 包含文件夹名称，避免命名冲突
      dts: 'src/types/auto-import-components.d.ts', // 类型提示文件
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log'],
  },
})
