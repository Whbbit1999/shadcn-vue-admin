import { afterEach, describe, expect, it, vi } from 'vitest'

import { EnvSchema } from '@/validators/env.validator'

describe('envSchema validation', () => {
  describe('valid environment variables', () => {
    it('should validate with all required fields', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'https://api.example.com',
        VITE_SERVER_API_PREFIX: '/v1',
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.VITE_SERVER_API_URL).toBe('https://api.example.com')
        expect(result.data.VITE_SERVER_API_PREFIX).toBe('/v1')
        expect(result.data.VITE_SERVER_API_TIMEOUT).toBe(5000) // default value
      }
    })

    it('should validate with custom timeout', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'http://localhost:3000',
        VITE_SERVER_API_PREFIX: '/api',
        VITE_SERVER_API_TIMEOUT: 10000,
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.VITE_SERVER_API_TIMEOUT).toBe(10000)
      }
    })

    it('should coerce string timeout to number', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'https://api.example.com',
        VITE_SERVER_API_PREFIX: '/api',
        VITE_SERVER_API_TIMEOUT: '15000',
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.VITE_SERVER_API_TIMEOUT).toBe(15000)
        expect(typeof result.data.VITE_SERVER_API_TIMEOUT).toBe('number')
      }
    })
  })

  describe('invalid environment variables', () => {
    it('should fail when VITE_SERVER_API_URL is missing', () => {
      const invalidEnv = {
        VITE_SERVER_API_PREFIX: '/api',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('VITE_SERVER_API_URL')
      }
    })

    it('should fail when VITE_SERVER_API_PREFIX is missing', () => {
      const invalidEnv = {
        VITE_SERVER_API_URL: 'https://api.example.com',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('VITE_SERVER_API_PREFIX')
      }
    })

    it('should fail when VITE_SERVER_API_URL is not a valid URL', () => {
      const invalidEnv = {
        VITE_SERVER_API_URL: 'not-a-url',
        VITE_SERVER_API_PREFIX: '/api',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('VITE_SERVER_API_URL')
        expect(result.error.issues[0].code).toBe('invalid_format')
      }
    })

    it('should fail when VITE_SERVER_API_TIMEOUT cannot be coerced to number', () => {
      const invalidEnv = {
        VITE_SERVER_API_URL: 'https://api.example.com',
        VITE_SERVER_API_PREFIX: '/api',
        VITE_SERVER_API_TIMEOUT: 'invalid-number',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('VITE_SERVER_API_TIMEOUT')
      }
    })
  })

  describe('uRL validation', () => {
    it('should accept https URLs', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'https://secure-api.example.com',
        VITE_SERVER_API_PREFIX: '/v1',
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
    })

    it('should accept http URLs', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'http://localhost:3000',
        VITE_SERVER_API_PREFIX: '/api',
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
    })

    it('should accept URLs with port numbers', () => {
      const validEnv = {
        VITE_SERVER_API_URL: 'https://api.example.com:8080',
        VITE_SERVER_API_PREFIX: '/api',
      }

      const result = EnvSchema.safeParse(validEnv)
      expect(result.success).toBe(true)
    })

    it('should reject relative URLs', () => {
      const invalidEnv = {
        VITE_SERVER_API_URL: '/api',
        VITE_SERVER_API_PREFIX: '/v1',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
    })

    it('should reject empty string as URL', () => {
      const invalidEnv = {
        VITE_SERVER_API_URL: '',
        VITE_SERVER_API_PREFIX: '/api',
      }

      const result = EnvSchema.safeParse(invalidEnv)
      expect(result.success).toBe(false)
    })
  })
})

describe('env module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('falls back to safe values instead of crashing when env is invalid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubEnv('VITE_SERVER_API_URL', 'not-a-url')

    const { env, envError } = await import('@/utils/env')

    expect(envError).not.toBeNull()
    expect(env.VITE_SERVER_API_URL).toBe('')
    expect(env.VITE_SERVER_API_PREFIX).toBe('/api')
    expect(env.VITE_SERVER_API_TIMEOUT).toBe(5000)
  })

  it('uses the parsed values when env is valid', async () => {
    vi.stubEnv('VITE_SERVER_API_URL', 'https://api.example.com')
    vi.stubEnv('VITE_SERVER_API_PREFIX', '/v1')
    vi.stubEnv('VITE_SERVER_API_TIMEOUT', '9000')

    const { env, envError } = await import('@/utils/env')

    expect(envError).toBeNull()
    expect(env).toEqual({
      VITE_SERVER_API_URL: 'https://api.example.com',
      VITE_SERVER_API_PREFIX: '/v1',
      VITE_SERVER_API_TIMEOUT: 9000,
    })
  })
})
