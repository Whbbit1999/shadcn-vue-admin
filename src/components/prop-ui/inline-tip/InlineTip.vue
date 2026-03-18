<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import type { InlineTipVariants } from '.'

import { inlineTipVariants } from '.'

interface Props {
  label: string
  variant?: InlineTipVariants['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
})
</script>

<template>
  <div
    :class="cn(
      'bg-secondary text-secondary-foreground text-sm inline-grid grid-cols-[4px_1fr] items-start gap-3 rounded-md border p-3',
      props.class,
    )"
  >
    <div
      :class="cn(
        'h-full w-1 rounded-full',
        inlineTipVariants({ variant: props.variant }))"
    />

    <div class="text-muted-foreground">
      <strong class="text-sm font-semibold text-foreground mr-2">{{ props.label }}:</strong>
      <slot />
    </div>
  </div>
</template>
