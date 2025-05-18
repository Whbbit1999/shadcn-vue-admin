import type { z } from 'zod'

import type { Config } from '@/components/ui/auto-form'

export type AutoFormFieldConfig<T extends z.ZodObject<any>> = Config<z.infer<T>>
