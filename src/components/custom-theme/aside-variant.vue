<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { SidebarProps } from '@/components/ui/sidebar'

import { Button } from '@/components/ui/button'
import { useSidebarConfigStore } from '@/stores/sidebar-config'

const sidebarConfigStore = useSidebarConfigStore()
const { asideVariant } = storeToRefs(sidebarConfigStore)
const variants = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'inset', label: 'Inset' },
  { value: 'floating', label: 'Floating' },
] satisfies { value: SidebarProps['variant'], label: string }[]
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <div id="aside-variant-label" class="text-xs font-medium">
      Aside Variant
    </div>
    <div role="group" aria-labelledby="aside-variant-label" class="grid grid-cols-3 gap-2 py-1.5">
      <Button
        v-for="variant in variants"
        :key="variant.value"
        variant="outline"
        class="h-8 px-2"
        :class="asideVariant === variant.value ? 'border-foreground border-2' : ''"
        :aria-pressed="asideVariant === variant.value"
        @click="sidebarConfigStore.setAsideVariant(variant.value)"
      >
        {{ variant.label }}
      </Button>
    </div>
  </div>
</template>
