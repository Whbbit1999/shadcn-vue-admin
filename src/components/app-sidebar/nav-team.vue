<script lang="ts" setup>
import {
  ChevronDown,
  ChevronRight,
} from 'lucide-vue-next'

import type { NavGroup, NavItem } from './types'

const { navMain } = defineProps<{
  navMain: NavGroup[]
}>()

const route = useRoute()

function isCollapsed(menu: NavItem): boolean {
  const pathname = route.path
  navMain.forEach((group) => {
    group.items.forEach((item) => {
      if (item.url === pathname) {
        return true
      }
    })
  })
  return !!menu.items?.some(item => item.url === pathname)
}

function isActive(menu: NavItem): boolean {
  const pathname = route.path
  if (menu.url) {
    return pathname === menu.url
  }
  return !!menu.items?.some(item => item.url === pathname)
}
</script>

<template>
  <UiSidebarGroup v-for="group in navMain" :key="group.title">
    <UiSidebarGroupLabel>{{ group.title }}</UiSidebarGroupLabel>
    <UiSidebarMenu>
      <template v-for="menu in group.items" :key="menu.title">
        <UiSidebarMenuItem v-if="!menu.items">
          <UiSidebarMenuButton as-child :is-active="isActive(menu)">
            <router-link :to="menu.url">
              <component :is="menu.icon" />
              <span>{{ menu.title }}</span>
            </router-link>
          </UiSidebarMenuButton>
        </UiSidebarMenuItem>
        <UiSidebarMenuItem v-else>
          <UiCollapsible as-child :default-open="isCollapsed(menu)">
            <UiCollapsibleTrigger as-child>
              <UiSidebarMenuButton
                :tooltip="menu.title"
              >
                <component :is="menu.icon" />
                <span>{{ menu.title }}</span>
                <ChevronRight
                  v-if="!isCollapsed(menu)"
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
                <ChevronDown
                  v-else
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </UiSidebarMenuButton>
            </UiCollapsibleTrigger>
            <UiCollapsibleContent>
              <UiSidebarMenuSub>
                <UiSidebarMenuSubItem v-for="subItem in menu.items" :key="subItem.title">
                  <UiSidebarMenuSubButton as-child :is-active="isActive(subItem as NavItem)">
                    <router-link :to="subItem?.url || '/'">
                      <span>{{ subItem.title }}</span>
                    </router-link>
                  </UiSidebarMenuSubButton>
                </UiSidebarMenuSubItem>
              </UiSidebarMenuSub>
            </UiCollapsibleContent>
          </UiCollapsible>
        </UiSidebarMenuItem>
      </template>
    </UiSidebarMenu>
  </UiSidebarGroup>
</template>
