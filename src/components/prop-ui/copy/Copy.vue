<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { CopyCheckIcon, CopyIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import type { ButtonVariants } from '@/components/ui/button'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface Props {
  content: string
  size?: ButtonVariants['size']
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
  copyTooltipText?: string
  copiedTooltipText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  variant: 'outline',
  copyTooltipText: undefined,
  copiedTooltipText: undefined,
})

const { t } = useI18n()

const copyTooltip = computed(() => props.copyTooltipText ?? t('common.copy'))
const copiedTooltip = computed(() => props.copiedTooltipText ?? t('common.copied'))

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
            <CopyIcon v-if="!copied" />
            <CopyCheckIcon v-else />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p v-if="!copied">{{ copyTooltip }}: {{ props.content }}</p>
          <p v-else>{{ copiedTooltip }}: {{ props.content }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </span>
  <span v-else>{{ $t('common.clipboardUnsupported') }}</span>
</template>
