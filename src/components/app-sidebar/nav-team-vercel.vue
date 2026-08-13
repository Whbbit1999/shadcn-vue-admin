<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar'
import { useSidebarNavigation } from '@/composables/use-sidebar-navigation'
import { isExternalUrl } from '@/utils/is-external-url'

import type { NavGroup, NavItem } from './types'

import MenuButton from './menu-button.vue'

const { navMain } = defineProps<{
  navMain: NavGroup[]
}>()

const {
  navigationPath,
  currentMenuItems,
  currentMenuTitle,
  enterMenu,
  goBack,
  isMenuItemActive,
} = useSidebarNavigation(navMain)

/**
 * Handle back button click
 */
function handleGoBack() {
  goBack()
}
</script>

<template>
  <div class="w-full overflow-hidden">
    <Transition name="nav-view" mode="out-in">
      <!-- Root level: show all groups -->
      <div v-if="navigationPath.length === 0" key="root">
        <SidebarGroup v-for="group in navMain" :key="group.title">
          <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="menu in group.items" :key="menu.title">
              <!-- Leaf item -->
              <SidebarMenuItem v-if="!menu.items">
                <MenuButton
                  :is-active="isMenuItemActive(menu)"
                  :tooltip="menu.title"
                  :is-external-url="isExternalUrl(menu.url)"
                  :menu="menu as NavItem"
                />
              </SidebarMenuItem>

              <!-- Parent item: click to enter next level -->
              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  class="cursor-pointer"
                  :tooltip="menu.title"
                  :is-active="isMenuItemActive(menu)"
                  @click="enterMenu(menu)"
                >
                  <component :is="menu.icon" v-if="menu.icon" />
                  <span>{{ menu.title }}</span>
                  <ChevronRightIcon class="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </div>

      <!-- Nested level: show back button and current level items -->
      <div v-else :key="`nested-${navigationPath.join('-')}`">
        <SidebarGroup>
          <!-- Menu items -->
          <SidebarMenu>
            <!-- Navigation header with back button -->
            <SidebarMenuItem>
              <SidebarMenuButton
                class="cursor-pointer hover:bg-muted/50"
                tooltip=""
                @click="handleGoBack"
              >
                <ChevronLeftIcon />
                <div class="text-center w-full text-sm font-medium">
                  {{ currentMenuTitle }}
                </div>
                <ChevronRightIcon class="invisible" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator class="mx-0" />
            <template v-for="item in currentMenuItems" :key="item.title">
              <!-- Leaf item -->
              <SidebarMenuItem v-if="!item.items">
                <MenuButton
                  :is-active="isMenuItemActive(item as NavItem)"
                  :tooltip="item.title"
                  :is-external-url="isExternalUrl((item as any).url)"
                  :menu="item as NavItem"
                />
              </SidebarMenuItem>

              <!-- Parent item: click to enter next level -->
              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  class="cursor-pointer"
                  :tooltip="item.title"
                  @click="enterMenu(item as NavItem)"
                >
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <ChevronRightIcon class="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Restrained view transition: quick fade + subtle vertical shift */
.nav-view-enter-active,
.nav-view-leave-active {
  transition:
    opacity 90ms ease-in-out,
    transform 90ms ease-in-out;
}

.nav-view-enter-from {
  opacity: 0;
  transform: translateX(5px);
}

.nav-view-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}
</style>
