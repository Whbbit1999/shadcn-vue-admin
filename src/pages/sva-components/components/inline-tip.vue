<script lang="ts" setup>
import { InlineTip } from '@/components/sva-ui/inline-tip'
</script>

<template>
  <section>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
      Inline Tip
    </h4>
    <blockquote class="my-2 border-l-2 pl-6 italic">
      Source code in
      <code
        class="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold"
      >
        src/components/sva-ui/inline-tip
      </code>
    </blockquote>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      type = 'info'
    </h5>

    <InlineTip label="Tip" variant="info">
      This is an info inline tip.
    </InlineTip>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      type = 'warning'
    </h5>

    <InlineTip label="Tip" variant="warning">
      This is an warning inline tip.
    </InlineTip>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      type = 'success'
    </h5>

    <InlineTip label="Tip" variant="success">
      This is an success inline tip.
    </InlineTip>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      type = 'error'
    </h5>

    <InlineTip label="Tip" variant="error">
      This is an error inline tip.
    </InlineTip>
  </section>
</template>
