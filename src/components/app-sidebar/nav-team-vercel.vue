<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'

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
    <!-- Root level: show all groups -->
    <div v-if="navigationPath.length === 0" key="root">
      <UiSidebarGroup v-for="group in navMain" :key="group.title">
        <UiSidebarGroupLabel>{{ group.title }}</UiSidebarGroupLabel>
        <UiSidebarMenu v-auto-animate>
          <template v-for="menu in group.items" :key="menu.title">
            <!-- Leaf item -->
            <UiSidebarMenuItem v-if="!menu.items">
              <MenuButton
                :is-active="isMenuItemActive(menu)"
                :tooltip="menu.title"
                :is-external-url="isExternalUrl(menu.url)"
                :menu="menu as NavItem"
              />
            </UiSidebarMenuItem>

            <!-- Parent item: click to enter next level -->
            <UiSidebarMenuItem v-else>
              <UiSidebarMenuButton
                class="cursor-pointer"
                :tooltip="menu.title"
                :is-active="isMenuItemActive(menu)"
                @click="enterMenu(menu)"
              >
                <component :is="menu.icon" v-if="menu.icon" />
                <span>{{ menu.title }}</span>
                <ChevronRightIcon class="ml-auto w-4 h-4" />
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
          </template>
        </UiSidebarMenu>
      </UiSidebarGroup>
    </div>

    <!-- Nested level: show back button and current level items -->
    <div v-else :key="`nested-${navigationPath.join('-')}`">
      <UiSidebarGroup>
        <!-- Menu items -->
        <UiSidebarMenu v-auto-animate>
          <!-- Navigation header with back button -->
          <UiSidebarMenuItem>
            <UiSidebarMenuButton
              class="cursor-pointer hover:bg-muted/50"
              tooltip=""
              @click="handleGoBack"
            >
              <ChevronLeftIcon />
              <div class="text-center w-full text-sm font-medium">
                {{ currentMenuTitle }}
              </div>
              <ChevronRightIcon class="invisible" />
            </UiSidebarMenuButton>
          </UiSidebarMenuItem>

          <UiSidebarSeparator class="mx-0" />
          <template v-for="item in currentMenuItems" :key="item.title">
            <!-- Leaf item -->
            <UiSidebarMenuItem v-if="!item.items">
              <MenuButton
                :is-active="isMenuItemActive(item as NavItem)"
                :tooltip="item.title"
                :is-external-url="isExternalUrl((item as any).url)"
                :menu="item as NavItem"
              />
            </UiSidebarMenuItem>

            <!-- Parent item: click to enter next level -->
            <UiSidebarMenuItem v-else>
              <UiSidebarMenuButton
                class="cursor-pointer"
                :tooltip="item.title"
                @click="enterMenu(item as NavItem)"
              >
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRightIcon class="ml-auto w-4 h-4" />
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
          </template>
        </UiSidebarMenu>
      </UiSidebarGroup>
    </div>
  </div>
</template>
