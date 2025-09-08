<script lang='ts' setup generic="T">
import type { Table as VueTable } from '@tanstack/vue-table'

import { XIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface BulkActionsProps<T> {
  table: VueTable<T>
  entityName: string
}

const { table, entityName } = defineProps<BulkActionsProps<T>>()

const toolbarRef = useTemplateRef<HTMLDivElement>('toolbarRef')
const selectedRows = computed(() => table.getSelectedRowModel().rows)
const selectedCount = computed(() => selectedRows.value.length || 0)

function handleClearSelection() {
  table.resetRowSelection()
}
</script>

<template>
  <div
    ref="toolbarRef"
    :class="cn(
      'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
      'transition-all delay-100 duration-300 ease-out hover:scale-105',
      'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
    )"
  >
    <section
      v-if="selectedCount" :class="cn(
        'p-2 shadow-xl',
        'rounded-xl border',
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg',
        'flex items-center gap-x-2',
      )"
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="outline"
            size="icon"
            class="size-6 rounded-full"
            aria-label="Clear selection"
            title="Clear selection (Escape)"
            @click="handleClearSelection"
          >
            <XIcon />
            <span class="sr-only">Clear selection</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear selection (Escape)</p>
        </TooltipContent>
      </Tooltip>

      <Separator
        class="h-5"
        orientation="vertical"
        aria-hidden="true"
      />

      <section id="bulk-actions-description" class="flex items-center gap-x-1 text-sm">
        <UiBadge
          class="min-w-8 rounded-lg"
          :aria-label="`${selectedCount} selected`"
        >
          {{ selectedCount }}
        </UiBadge>
        {{ entityName }} selected
      </section>

      <Separator
        class="h-5"
        orientation="vertical"
        aria-hidden="true"
      />

      <slot />
    </section>
  </div>
</template>
