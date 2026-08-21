import { z } from 'zod'

import { userRoleSchema } from '../data/schema'

export const userInviteValidator = z.object({
  email: z.email(),
  role: userRoleSchema,
  description: z.string().optional(),
})

export type UserInviteValidator = z.infer<typeof userInviteValidator>
