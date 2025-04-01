import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/lib/**',
  ],
  ...pluginQuery.configs['flat/recommended'],
})
