<script lang="ts" setup>
import { ClipboardCheckIcon, ClipboardIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'

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
        <UiButton variant="ghost" size="icon" class="p-1" @click="copy(content)">
          <ClipboardIcon v-if="!copied" />
          <ClipboardCheckIcon v-else />
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Copy</p>
      </UiTooltipContent>
    </UiTooltip>
  </UiTooltipProvider>
</template>
