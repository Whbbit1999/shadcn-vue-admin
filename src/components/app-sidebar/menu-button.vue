<script lang='ts' setup>
import { ExternalLinkIcon } from '@lucide/vue'

import type { NavItem } from './types'

defineProps<{
  isActive: boolean
  tooltip?: string
  isExternalUrl?: boolean
  menu: NavItem
}>()
</script>

<template>
  <UiSidebarMenuButton
    as-child
    :is-active="isActive"
    :tooltip="tooltip"
  >
    <a v-if="isExternalUrl" :href="menu.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
      <component :is="menu.icon" v-if="menu.icon" />
      <span>{{ menu.title }}</span>
      <ExternalLinkIcon class="w-4 h-4 ml-auto" />
    </a>

    <router-link v-else :to="menu.url!" class="flex items-center gap-2">
      <component :is="menu.icon" v-if="menu.icon" />
      <span>{{ menu.title }}</span>
    </router-link>
  </UiSidebarMenuButton>
</template>
