import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  type: 'app',
  vue: {
    overrides: {
      'vue/block-lang': ['warn', {
        script: { lang: ['ts', 'tsx'] },
      }],
    },
  },
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

  imports: {
    overrides: {
      'perfectionist/sort-imports': ['error', {
        tsconfig: { rootDir: '.' },
      }],
    },
  },
  ...pluginQuery.configs['flat/recommended'],
})
