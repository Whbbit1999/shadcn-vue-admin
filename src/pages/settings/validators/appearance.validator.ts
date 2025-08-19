import { z } from 'zod'

export const appearanceValidator = z.object({
  theme: z
    .enum(['light', 'dark'], {
      error: 'Please select a theme.',
    }),
  font: z
    .enum(['inter', 'manrope', 'system'], {
      error: 'Please select a font.',
    }),
})
