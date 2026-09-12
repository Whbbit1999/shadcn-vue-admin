import type { PluginOption } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Component from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts'
import { defineConfig } from 'vitest/config'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

const RouteGenerateExclude = ['**/components/**', '**/layouts/**', '**/data/**', '**/types/**']

export default defineConfig({
  plugins: [
    VueRouter({
      exclude: RouteGenerateExclude,
      dts: 'src/types/route-map.d.ts',
    }),
    vue(),
    tailwindcss(),
    ...(process.env.ANALYZE
      ? [visualizer({ gzipSize: true, brotliSize: true }) as PluginOption]
      : []),
    Layouts({
      defaultLayout: 'default',
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
      ],
      imports: [
        'vue',
        VueRouterAutoImports,
      ],
      dirs: [
        'src/composables/**/*.ts',
        'src/constants/**/*.ts',
        'src/stores/**/*.ts',
      ],
      defaultExportByFilename: true,
      dts: 'src/types/auto-import.d.ts',
    }),
    Component({
      dirs: [
        'src/components',
      ],
      collapseSamePrefixes: true,
      directoryAsNamespace: true,
      dts: 'src/types/auto-import-components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist(['> 1%', 'last 2 versions'])),
    },
  },

  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/lib/**/*.ts',
        'src/services/**/*.ts',
        'src/stores/**/*.ts',
        'src/composables/**/*.ts',
        'src/utils/**/*.ts',
        'src/validators/**/*.ts',
        'src/router/guard/**/*.ts',
      ],
      exclude: ['src/**/*.d.ts'],
    },
  },
})
