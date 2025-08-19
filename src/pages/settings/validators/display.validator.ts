import { z } from 'zod'

export const displayValidator = z.object({
  items: z
    .array(z.string())
    .refine(value => value.some(item => item), {
      error: 'You have to select at least one item.',
    }),
})
