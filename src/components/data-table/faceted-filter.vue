<script setup lang="ts" generic="T extends RowData">
import type { Column, RowData } from '@tanstack/vue-table'

import { CheckIcon, CirclePlusIcon } from '@lucide/vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { features } from './features'
import type { FacetedFilterOption } from './types'

interface DataTableFacetedFilter {
  column?: Column<typeof features, T, any>
  title?: string
  options: FacetedFilterOption[]
}

const props = defineProps<DataTableFacetedFilter>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))
const filterFunction = (list: DataTableFacetedFilter['options'], term: string) => list.filter(i => i.label.toLowerCase()?.includes(term))

function handleSelect(option: FacetedFilterOption) {
  const isSelected = selectedValues.value.has(option.value)
  if (isSelected) {
    selectedValues.value.delete(option.value)
  }
  else {
    selectedValues.value.add(option.value)
  }
  const filterValues = Array.from(selectedValues.value)
  props.column?.setFilterValue(
    filterValues.length ? filterValues : undefined,
  )
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <CirclePlusIcon class="size-4 mr-2" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="h-4 mx-2" />
          <Badge
            variant="secondary"
            class="px-1 font-normal rounded-sm lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="px-1 font-normal rounded-sm"
            >
              {{ selectedValues.size }} selected
            </Badge>

            <template v-else>
              <Badge
                v-for="option in options
                  .filter((option) => selectedValues.has(option.value))"
                :key="option.value"
                variant="secondary"
                class="px-1 font-normal rounded-sm"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command
        :filter-function="filterFunction"
      >
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="handleSelect(option)"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <CheckIcon :class="cn('h-4 w-4', selectedValues.has(option.value) ? 'text-primary-foreground' : '')" />
              </div>
              <component :is="option.icon" v-if="option.icon" class="size-4 mr-2 text-muted-foreground" />
              <span>{{ option.label }}</span>
              <span v-if="facets?.get(option.value)" class="flex items-center justify-center size-4 ml-auto font-mono text-xs">
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>

          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Clear filters' }"
                class="justify-center text-center"
                @select="column?.setFilterValue(undefined)"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
