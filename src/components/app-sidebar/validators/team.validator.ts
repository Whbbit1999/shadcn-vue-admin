import { z } from 'zod'

export const teamAddValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Group name is required' })
    .max(50, { message: 'Group name must be less than 50 characters' }),
  slug: z
    .string()
    .min(1, { message: 'Group name is required' })
    .max(50, { message: 'Group name must be less than 50 characters' }),
  logo: z
    .string()
    .optional(),
})
