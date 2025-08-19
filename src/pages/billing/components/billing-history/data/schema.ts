import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const billingSchema = z.object({
  id: z.number(),
  date: z.iso.date(),
  amount: z.number(),
  plan: z.enum(['Free', 'Small Business', 'Enterprise']),
  status: z.enum([
    'paid',
    'unpaid',
    'overdue',
    'cancelled',
  ]),
  file: z.string().optional(),
  description: z.string().optional(),
  orderId: z.string().optional(),
})

export type Billing = z.infer<typeof billingSchema>
