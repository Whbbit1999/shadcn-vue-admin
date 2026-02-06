<script lang="ts" setup>
import { sidebarData } from './data/sidebar-data'
import NavFooter from './nav-footer.vue'
import NavTeam from './nav-team.vue'
</script>

<template>
  <UiSidebar collapsible="icon" class="z-50">
    <UiSidebarHeader>
      <div class="flex items-center gap-2 px-2 py-4">
        <div class="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
          <span class="text-lg font-bold">R</span>
        </div>
        <div class="grid flex-1 text-sm leading-tight text-left">
          <span class="font-semibold truncate">RAAS Admin</span>
          <span class="text-xs truncate">Dashboard</span>
        </div>
      </div>
    </UiSidebarHeader>

    <UiSidebarContent>
      <NavTeam :nav-main="sidebarData.navMain" />
    </UiSidebarContent>

    <UiSidebarFooter>
      <NavFooter :user="sidebarData.user" />
    </UiSidebarFooter>

    <UiSidebarRail />
  </UiSidebar>
</template>
