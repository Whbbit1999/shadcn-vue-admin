<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar'
import { useSidebarNavigation } from '@/composables/use-sidebar-navigation'
import { isExternalUrl } from '@/utils/is-external-url'

import type { NavGroup } from './types'

import MenuButton from './menu-button.vue'

const { navMain } = defineProps<{
  navMain: NavGroup[]
}>()

const {
  navigationPath,
  currentMenuItems,
  currentMenuTitleKey,
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
        <SidebarGroup v-for="group in navMain" :key="group.titleKey">
          <SidebarGroupLabel>{{ $t(group.titleKey) }}</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="menu in group.items" :key="menu.titleKey">
              <!-- Leaf item -->
              <SidebarMenuItem v-if="!menu.items">
                <MenuButton
                  :is-active="isMenuItemActive(menu)"
                  :is-external-url="isExternalUrl(menu.url)"
                  :menu="menu"
                />
              </SidebarMenuItem>

              <!-- Parent item: click to enter next level -->
              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  class="cursor-pointer"
                  :tooltip="$t(menu.titleKey)"
                  :is-active="isMenuItemActive(menu)"
                  @click="enterMenu(menu)"
                >
                  <component :is="menu.icon" v-if="menu.icon" />
                  <span>{{ $t(menu.titleKey) }}</span>
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
                  {{ $t(currentMenuTitleKey) }}
                </div>
                <ChevronRightIcon class="invisible" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator class="mx-0" />
            <template v-for="item in currentMenuItems" :key="item.titleKey">
              <!-- Leaf item -->
              <SidebarMenuItem v-if="!item.items">
                <MenuButton
                  :is-active="isMenuItemActive(item)"
                  :is-external-url="isExternalUrl(item.url)"
                  :menu="item"
                />
              </SidebarMenuItem>

              <!-- Parent item: click to enter next level -->
              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  class="cursor-pointer"
                  :tooltip="$t(item.titleKey)"
                  @click="enterMenu(item)"
                >
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ $t(item.titleKey) }}</span>
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
