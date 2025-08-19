import { z } from 'zod'

export const profileValidator = z.object({
  username: z
    .string()
    .min(2, {
      error: 'Username must be at least 2 characters.',
    })
    .max(30, {
      error: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .email({
      error: 'Please select an email to display.',
    }),
  bio: z
    .string()
    .max(160, { error: 'Bio must not be longer than 160 characters.' })
    .min(4, { error: 'Bio must be at least 2 characters.' }),
  urls: z
    .array(
      z.object({
        value: z.url({ error: 'Please enter a valid URL.' }),
      }),
    )
    .optional(),
})
