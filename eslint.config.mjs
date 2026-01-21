import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  type: 'app',
  vue: true,
  typescript: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },

  ignores: [
    '**/build/**',
    '**/components/ui/**',
  ],
  settings: {
    'import/core-modules': ['vue-router/auto-routes'],
  },
  globals: {
    definePage: 'readonly',
  },

  rules: {
    'perfectionist/sort-imports': ['error', {
      tsconfig: { rootDir: '.' },
    }],
    'yaml/indent': ['error', 2],
    'jsonc/indent': ['error', 2],
    'vue/block-lang': ['warn', {
      script: { lang: ['ts', 'tsx'] },
    }],
  },
  ...pluginQuery.configs['flat/recommended'],
})
