<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import type { BadgeVariants } from '@/components/ui/badge'

import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { StatusVariants } from '.'

import Status from './Status.vue'

const props = defineProps<{
  variant?: BadgeVariants['variant']
  rounded?: StatusVariants['rounded']
  class?: HTMLAttributes['class']
  color?: StatusVariants['color']
}>()
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <Status :color="props.color" :rounded="props.rounded" />
    <slot />
  </div>
</template>
