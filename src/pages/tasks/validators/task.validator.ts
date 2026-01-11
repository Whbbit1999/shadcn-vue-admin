import z from 'zod'

export const taskValidator = z.object({
  title: z.string().min(2).max(50),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type TaskValidator = z.infer<typeof taskValidator>
