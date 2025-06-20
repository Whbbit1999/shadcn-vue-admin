<script lang="ts" setup>
import { ThumbsDown } from 'lucide-vue-next'
</script>

<template>
  <UiTooltipProvider>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton variant="ghost" class="p-1">
          <ThumbsDown class="size-4" />
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>It's so bad</p>
      </UiTooltipContent>
    </UiTooltip>
  </UiTooltipProvider>
</template>

<style scoped>

</style>
