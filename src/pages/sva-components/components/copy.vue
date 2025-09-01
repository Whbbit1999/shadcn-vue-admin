<script lang="ts" setup>
import { Copy } from '@/components/sva-ui/copy'

const content = ref('copy something')
</script>

<template>
  <section>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
      Copy
    </h4>
    <blockquote class="my-2 border-l-2 pl-6 italic">
      Source code in
      <code
        class="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold"
      >
        src/components/sva-ui/copy
      </code>
    </blockquote>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      size = 'default'
    </h5>
    <div class="flex items-center gap-2">
      <UiInput v-model="content" class="w-[200px]" />
      <Copy :content variant="default" />
    </div>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      size = 'sm'
    </h5>
    <div class="flex items-center gap-2">
      <UiInput v-model="content" class="w-[200px]" />
      <Copy :content size="sm" />
    </div>
  </section>
</template>
