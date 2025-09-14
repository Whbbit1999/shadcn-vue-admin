<script lang='ts' setup>
import { cn } from '@/lib/utils'
</script>

<template>
  <main
    :class="cn(
      `grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 w-full`,
    )"
  >
    <aside>
      <slot name="aside" />
    </aside>

    <section>
      <slot name="default" />
    </section>
  </main>
</template>
