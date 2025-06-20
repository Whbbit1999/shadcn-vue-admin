<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { Clipboard, ClipboardCheck } from 'lucide-vue-next'

defineProps<Props>()

const { copy, copied } = useClipboard()

interface Props {
  content: string
}
</script>

<template>
  <UiTooltipProvider>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton variant="ghost" class="p-1" @click="copy(content)">
          <Clipboard v-if="!copied" class="size-4" />
          <ClipboardCheck v-else />
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Copy</p>
      </UiTooltipContent>
    </UiTooltip>
  </UiTooltipProvider>
</template>

<style scoped>

</style>
