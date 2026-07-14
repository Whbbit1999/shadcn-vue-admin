<script setup lang="ts">
import { navData, otherPages } from '@/constants/sidebar-data'

import type { NavGroup, NavItem } from '../app-sidebar/types'

import CommandItemHasIcon from './command-item-has-icon.vue'

const emit = defineEmits<{
  click: []
}>()

function getFlatNavItems(navData: NavGroup[]): NavItem[] {
  const flatItems: NavItem[] = []
  navData.forEach((group) => {
    group.items.forEach((item) => {
      if (item.items) {
        flatItems.push(...getFlatNavItems([item as unknown as NavGroup]))
      }
      else {
        flatItems.push(item)
      }
    })
  })
  return flatItems
}

const commands = getFlatNavItems([...navData, ...otherPages])

const router = useRouter()
const route = useRoute()
function commandItemClick(url: string) {
  emit('click')
  if (route.fullPath !== url) {
    router.push(url)
  }
}
</script>

<template>
  <UiCommandGroup heading="Pages">
    <UiCommandItem
      v-for="command in commands"
      :key="command.title"
      :value="command.title"
      @click="commandItemClick(command.url!)"
    >
      <CommandItemHasIcon :name="command.title" :icon="command.icon" />
    </UiCommandItem>
  </UiCommandGroup>
</template>
