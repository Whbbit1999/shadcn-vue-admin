<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import type { StatusVariants } from '.'

import { statusVariants } from '.'

interface Props extends PrimitiveProps {
  color?: StatusVariants['color']
  rounded?: StatusVariants['rounded']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <span
    :class="cn(
      'mr-1',
      statusVariants({ color, rounded }),
      props.class,
    )"
  >
    <span
      :class="cn(statusVariants({ color, rounded }), 'absolute inline-flex h-full w-full animate-ping opacity-75')"
    />
    <span :class="cn(statusVariants({ color, rounded }), props.class, 'relative inline-flex')" />
  </span>
</template>
