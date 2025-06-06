import { z } from 'zod'

export const notificationsValidator = z.object({
  type: z
    .enum(['all', 'mentions', 'none'], {
      required_error: 'You need to select a notification type.',
    }),
  mobile: z
    .boolean()
    .default(false)
    .optional(),
  communication_emails: z
    .boolean()
    .default(false)
    .optional(),
  social_emails: z
    .boolean()
    .default(false)
    .optional(),
  marketing_emails: z
    .boolean()
    .default(false)
    .optional(),
  security_emails: z
    .boolean(),
})
