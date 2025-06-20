<script setup lang="ts" generic="T">
import type { Column } from '@tanstack/vue-table'

import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps {
  column: Column<T, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <UiButton
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <ArrowDown v-if="column.getIsSorted() === 'desc'" class="size-4 ml-2" />
          <ArrowUp v-else-if=" column.getIsSorted() === 'asc'" class="size-4 ml-2" />
          <ChevronsUpDown v-else class="size-4 ml-2" />
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="start">
        <UiDropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUp class="mr-2 size-4 text-muted-foreground/70" />
          Asc
        </UiDropdownMenuItem>
        <UiDropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDown class="mr-2 size-4 text-muted-foreground/70" />
          Desc
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="column.toggleVisibility(false)">
          <EyeOff class="mr-2 size-4 text-muted-foreground/70" />
          Hide
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
