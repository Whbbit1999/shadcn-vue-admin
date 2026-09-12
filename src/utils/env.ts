import { z } from 'zod'

import type { env as Env } from '@/validators/env.validator'

import { EnvSchema } from '@/validators/env.validator'

/**
 * Safe values used when the environment is invalid, so the app can still boot
 * and surface `envError` instead of crashing in `constants/app-config.ts`.
 */
const FALLBACK_ENV: Env = {
  VITE_SERVER_API_URL: '',
  VITE_SERVER_API_PREFIX: '/api',
  VITE_SERVER_API_TIMEOUT: 5000,
}

const result = EnvSchema.safeParse(import.meta.env)

export const envError = result.success ? null : result.error

if (envError) {
  console.error('❌ Invalid env')
  console.error(z.flattenError(envError))
}

export const env: Env = result.success ? result.data : FALLBACK_ENV
