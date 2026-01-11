import { z } from 'zod'

export const userInviteValidator = z.object({
  email: z.email(),
  role: z.enum(['superadmin', 'admin', 'cashier', 'manager']),
  description: z.string().optional(),
})

export type UserInviteValidator = z.infer<typeof userInviteValidator>
