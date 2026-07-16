import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { resolveSystemConfigValue } from '../use-system-config'

const schema = z.object({
  theme: z.enum(['light', 'dark']),
  font: z.string(),
})

const fallback = {
  theme: 'light',
  font: 'inter',
} as const

describe('resolveSystemConfigValue', () => {
  it('parses valid config JSON', () => {
    expect(resolveSystemConfigValue(JSON.stringify({ theme: 'dark', font: 'system' }), schema, fallback)).toEqual({
      theme: 'dark',
      font: 'system',
    })
  })

  it('falls back for invalid JSON', () => {
    expect(resolveSystemConfigValue('{invalid', schema, fallback)).toEqual(fallback)
  })

  it('falls back for schema mismatch', () => {
    expect(resolveSystemConfigValue(JSON.stringify({ theme: 'sepia', font: 'system' }), schema, fallback)).toEqual(fallback)
  })
})
