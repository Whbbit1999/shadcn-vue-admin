<script lang="ts" setup>
import { Status, StatusBadge } from '@/components/sva-ui/status-badge'
</script>

<template>
  <section>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
      StatusBadge
    </h4>
    <blockquote class="my-2 border-l-2 pl-6 italic">
      Source code in
      <code
        class="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold"
      >
        src/components/sva-ui/status-badge
      </code>
    </blockquote>

    <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
      Use Status only
    </h5>
    <div class="flex flex-col gap-2 flex-wrap">
      <div class="flex items-center gap-2">
        <Status rounded="xs" />
        <Status rounded="xs" color="red" />
        <Status rounded="xs" color="blue" />
        <Status rounded="xs" color="gray" />
        <Status rounded="xs" color="orange" />
        <Status rounded="xs" color="purple" />
      </div>

      <h5 class="scroll-m-20 font-semibold tracking-tight my-1">
        Use StatusBadge
      </h5>
      <div class="flex items-center gap-2 flex-wrap">
        <StatusBadge variant="outline" rounded="xs">
          Green
        </StatusBadge>
        <StatusBadge variant="outline" rounded="xs" color="red">
          Red
        </StatusBadge>
        <StatusBadge variant="outline" rounded="xs" color="blue">
          Blue
        </StatusBadge>
        <StatusBadge variant="outline" rounded="xs" color="gray">
          Gray
        </StatusBadge>
        <StatusBadge variant="outline" rounded="xs" color="orange">
          Orange
        </StatusBadge>
        <StatusBadge variant="outline" rounded="xs" color="purple">
          Purple
        </StatusBadge>
      </div>
    </div>
  </section>
</template>
