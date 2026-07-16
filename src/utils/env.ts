import { z } from 'zod'

import { EnvSchema } from '@/validators/env.validator'

const result = EnvSchema.safeParse(import.meta.env)

if (!result.success) {
  console.error('❌ Invalid env')
  console.error(z.flattenError(result.error))
}

export const env = result.data!
export const envError = !result.success ? result.error : null
