import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

export { default as Copy } from './Copy.vue'

export const copyVariants = cva(
  '',
  {
    variants: {
      iconSize: {
        default: 'size-4',
        sm: 'size-3',
      },
    },
    defaultVariants: {
      iconSize: 'default',
    },
  },
)

export type CopyVariants = VariantProps<typeof copyVariants>
