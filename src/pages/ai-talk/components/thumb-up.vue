<script lang="ts" setup>
import { ThumbsUp } from 'lucide-vue-next'
</script>

<template>
  <UiTooltipProvider>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton variant="ghost" class="p-1">
          <ThumbsUp class="size-4" />
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Good Job</p>
      </UiTooltipContent>
    </UiTooltip>
  </UiTooltipProvider>
</template>

<style scoped>

</style>
