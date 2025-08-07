<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { useClipboard } from '@vueuse/core'
import { Copy, CopyCheck } from 'lucide-vue-next'

import type { ButtonVariants } from '@/components/ui/button'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { copyVariants } from '.'

interface Props {
  content: string
  size?: 'sm' | 'default'
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
  copyTooltipText?: string
  copiedTooltipText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  variant: 'outline',
  copyTooltipText: 'Copy',
  copiedTooltipText: 'Copied',
})

const iconSize = computed(() => {
  return props.size === 'sm' ? 'sm' : 'default'
})

const size = computed(() => {
  return props.size === 'sm' ? 'sm' : 'icon'
})

const source = computed(() => props.content)

const { copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
  <span v-if="isSupported">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            :variant="props.variant"
            :size="size"
            :class="cn(props.class)"
            @click="copy(source)"
          >
            <Copy v-if="!copied" :class="cn(copyVariants({ iconSize }))" />
            <CopyCheck v-else :class="cn(copyVariants({ iconSize }))" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p v-if="!copied">{{ props.copyTooltipText }}: {{ props.content }}</p>
          <p v-else>{{ props.copiedTooltipText }}: {{ props.content }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </span>
  <span v-else>Your browser does not support Clipboard API</span>
</template>
