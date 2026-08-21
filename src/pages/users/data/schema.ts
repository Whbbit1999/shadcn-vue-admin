import { z } from 'zod'

export const userStatus = ['active', 'inactive', 'invited', 'suspended'] as const
export const userStatusSchema = z.enum(userStatus)
export type UserStatus = z.infer<typeof userStatusSchema>

export const userRoles = ['superadmin', 'admin', 'cashier', 'manager'] as const
export const userRoleSchema = z.enum(userRoles)
export type UserRole = z.infer<typeof userRoleSchema>

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
