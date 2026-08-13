<script setup lang="ts">
import { ChevronRightIcon, ExternalLinkIcon } from '@lucide/vue'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar'
import { isExternalUrl } from '@/utils/is-external-url'

import type { NavGroup, NavItem } from './types'

import MenuButton from './menu-button.vue'

const { navMain } = defineProps<{
  navMain: NavGroup[]
}>()

const route = useRoute()
const initialPath = route.path

const { state, isMobile } = useSidebar()

function isCollapsed(menu: NavItem): boolean {
  if (menu.url === initialPath)
    return true
  return !!menu.items?.some(item => item.url === initialPath)
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
  <SidebarGroup v-for="group in navMain" :key="group.title">
    <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="menu in group.items" :key="menu.title">
        <SidebarMenuItem v-if="!menu.items">
          <MenuButton
            :is-active="isActive(menu)"
            :tooltip="menu.title"
            :is-external-url="isExternalUrl(menu.url)"
            :menu="menu as NavItem"
          />
        </SidebarMenuItem>

        <SidebarMenuItem v-else>
          <!-- sidebar expanded -->
          <Collapsible
            v-if="state !== 'collapsed' || isMobile"
            as-child :default-open="isCollapsed(menu)"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="menu.title">
                  <component :is="menu.icon" v-if="menu.icon" />
                  <span>{{ menu.title }}</span>
                  <ChevronRightIcon
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem v-for="subItem in menu.items" :key="subItem.title">
                  <SidebarMenuSubButton as-child :is-active="isActive(subItem as NavItem)">
                    <a v-if="isExternalUrl(subItem?.url)" :href="subItem?.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
                      <component :is="subItem.icon" v-if="subItem.icon" />
                      <span>{{ subItem.title }}</span>
                      <ExternalLinkIcon class="w-4 h-4 ml-auto" />
                    </a>
                    <router-link v-else :to="subItem?.url || '/'">
                      <component :is="subItem.icon" v-if="subItem.icon" />
                      <span>{{ subItem.title }}</span>
                    </router-link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>

          <!-- sidebar collapsed -->
          <DropdownMenu v-else>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton :tooltip="menu.title">
                <component :is="menu.icon" v-if="menu.icon" />
                <span>{{ menu.title }}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuLabel>{{ menu.title }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="subItem in menu.items" :key="subItem.title" as-child>
                <MenuButton
                  :is-active="isActive(subItem as NavItem)"
                  :tooltip="subItem.title"
                  :is-external-url="isExternalUrl(subItem?.url)"
                  :menu="subItem as NavItem"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
