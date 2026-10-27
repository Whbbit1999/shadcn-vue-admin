<script setup lang="ts">
import { ChevronRightIcon, LayoutListIcon } from '@lucide/vue'
import { storeToRefs } from 'pinia'

import type { NavigationMode } from '@/stores/sidebar-config'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useSidebarConfigStore } from '@/stores/sidebar-config'

const sidebarConfigStore = useSidebarConfigStore()
const { navigationMode } = storeToRefs(sidebarConfigStore)

const menuStyles: Array<{
  value: NavigationMode
  labelKey: string
  icon: any
  descriptionKey: string
}> = [
  {
    value: 'collapsible',
    labelKey: 'settings.sidebarStyle.collapsible',
    icon: LayoutListIcon,
    descriptionKey: 'settings.sidebarStyle.collapsibleDescription',
  },
  {
    value: 'vercel',
    labelKey: 'settings.sidebarStyle.vercel',
    icon: ChevronRightIcon,
    descriptionKey: 'settings.sidebarStyle.vercelDescription',
  },
]

function handleMenuStyleChange(style: NavigationMode) {
  sidebarConfigStore.setNavigationMode(style)
}
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <Label for="menu-style" class="text-xs">
      {{ $t('settings.sidebarStyle.label') }}
    </Label>
    <div class="grid grid-cols-2 gap-2 py-1.5">
      <Button
        v-for="style in menuStyles"
        :key="style.value"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="navigationMode === style.value ? 'border-foreground border-2' : ''"
        :title="$t(style.descriptionKey)"
        @click="handleMenuStyleChange(style.value)"
      >
        <component :is="style.icon" class="w-4 h-4" />
        {{ $t(style.labelKey) }}
      </Button>
    </div>
  </div>
</template>
