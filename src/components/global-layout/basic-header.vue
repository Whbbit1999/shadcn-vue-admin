<script lang="ts" setup>
import { cn } from '@/lib/utils'

import type { LayoutHeaderProps } from './types'

defineProps<LayoutHeaderProps>()
</script>

<template>
  <header
    :class="cn(
      'flex flex-col md:flex-row gap-2 justify-between py-2',
      sticky ? 'sticky top-0 z-40 bg-background' : '',
    )"
  >
    <main>
      <h1 class="text-2xl font-bold">
        {{ title }}
      </h1>
      <p v-if="description" class="text-muted-foreground">
        {{ description }}
      </p>
    </main>

    <aside class="flex items-center gap-2 flex-wrap">
      <slot name="actions" />
    </aside>
  </header>
</template>
