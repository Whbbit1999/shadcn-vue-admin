import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

export { default as InlineTip } from './InlineTip.vue'

export const inlineTipVariants = cva(
  '',
  {
    variants: {
      variant: {
        info: 'bg-stone-400 dark:bg-stone-600',
        warning: 'bg-yellow-400 dark:bg-yellow-600',
        success: 'bg-green-400 dark:bg-green-600',
        error: 'bg-rose-400 dark:bg-rose-600',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

export type InlineTipVariants = VariantProps<typeof inlineTipVariants>
