<script lang="ts" setup>
import { ChevronRightIcon, LayoutListIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'

import type { NavigationMode } from '@/stores/sidebar-config'

import { useSidebarConfigStore } from '@/stores/sidebar-config'

const sidebarConfigStore = useSidebarConfigStore()
const { navigationMode } = storeToRefs(sidebarConfigStore)

const menuStyles: Array<{
  value: NavigationMode
  label: string
  icon: any
  description: string
}> = [
  {
    value: 'collapsible',
    label: 'Collapsible',
    icon: LayoutListIcon,
    description: 'Traditional collapsible menu',
  },
  {
    value: 'vercel',
    label: 'Vercel Style',
    icon: ChevronRightIcon,
    description: 'Click to navigate to the next level',
  },
]

function handleMenuStyleChange(style: NavigationMode) {
  sidebarConfigStore.setNavigationMode(style)
}
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel for="menu-style" class="text-xs">
      Menu Style
    </UiLabel>
    <div class="grid grid-cols-2 gap-2 py-1.5">
      <UiButton
        v-for="style in menuStyles"
        :key="style.value"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="navigationMode === style.value ? 'border-foreground border-2' : ''"
        :title="style.description"
        @click="handleMenuStyleChange(style.value)"
      >
        <component :is="style.icon" class="w-4 h-4" />
        {{ style.label }}
      </UiButton>
    </div>
  </div>
</template>
