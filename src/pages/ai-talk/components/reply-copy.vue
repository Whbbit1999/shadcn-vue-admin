<script setup lang="ts">
import { ClipboardCheckIcon, ClipboardIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps<Props>()

const { copy, copied } = useClipboard()

interface Props {
  content: string
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon" class="p-1" @click="copy(content)">
          <ClipboardIcon v-if="!copied" />
          <ClipboardCheckIcon v-else />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
