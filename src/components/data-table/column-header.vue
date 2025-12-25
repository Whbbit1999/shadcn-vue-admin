<script setup lang="ts" generic="T">
import type { Column } from '@tanstack/vue-table'

import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon, PinIcon, PinOffIcon } from 'lucide-vue-next'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps {
  column: Column<T, any>
  title: string
}

const props = defineProps<DataTableColumnHeaderProps>()

const canPinned = computed(() => props.column.getCanPin())
const canSorted = computed(() => props.column.getCanSort())
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="canSorted || canPinned" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <UiButton
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <template v-if="canPinned">
            <PinIcon v-if="props.column.getIsPinned()" class="ml-2 size-4 text-primary" />
          </template>

          <span>{{ title }}</span>

          <template v-if="canSorted">
            <ArrowDownIcon v-if="props.column.getIsSorted() === 'desc'" class="ml-2 size-4" />
            <ArrowUpIcon v-else-if="props.column.getIsSorted() === 'asc'" class="ml-2 size-4" />
            <ChevronsUpDownIcon v-else class="ml-2 size-4" />
          </template>
        </UiButton>
      </UiDropdownMenuTrigger>

      <UiDropdownMenuContent align="start">
        <template v-if="canSorted">
          <UiDropdownMenuItem @click="props.column.toggleSorting(false)">
            <ArrowUpIcon class="mr-2 size-4 text-muted-foreground/70" />
            Asc
          </UiDropdownMenuItem>
          <UiDropdownMenuItem @click="props.column.toggleSorting(true)">
            <ArrowDownIcon class="mr-2 size-4 text-muted-foreground/70" />
            Desc
          </UiDropdownMenuItem>
          <UiDropdownMenuItem @click="props.column.clearSorting()">
            <ChevronsUpDownIcon class="mr-2 size-4 text-muted-foreground/70" />
            Clear Sorting
          </UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
        </template>

        <UiDropdownMenuItem @click="props.column.toggleVisibility(false)">
          <EyeOffIcon class="mr-2 size-4 text-muted-foreground/70" />
          Hide
        </UiDropdownMenuItem>

        <template v-if="canPinned">
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem @click="props.column.pin('left')">
            <ArrowLeftIcon class="mr-2 size-4 text-muted-foreground/70" />
            Pin Left
          </UiDropdownMenuItem>
          <UiDropdownMenuItem @click="props.column.pin('right')">
            <ArrowRightIcon class="mr-2 size-4 text-muted-foreground/70" />
            Pin Right
          </UiDropdownMenuItem>
          <UiDropdownMenuItem @click="props.column.pin(false)">
            <PinOffIcon class="mr-2 size-4 text-muted-foreground/70" />
            Unpin
          </UiDropdownMenuItem>
        </template>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
