import type { PluginOption } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import Layouts from 'vite-plugin-vue-layouts'
import { defineConfig } from 'vitest/config'
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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
