<script lang="ts" setup>
import { sidebarData } from './data/sidebar-data'

import NavFooter from './nav-footer.vue'
import NavGroup from './nav-group.vue'
import TeamSwitcher from './team-switcher.vue'
</script>

<template>
  <UiSidebar collapsible="icon" class="z-50">
    <UiSidebarHeader>
      <TeamSwitcher :teams="sidebarData.teams" />
    </UiSidebarHeader>

    <UiSidebarContent>
      <NavGroup :nav-main="sidebarData.navMain" />
    </UiSidebarContent>

    <UiSidebarFooter>
      <NavFooter :user="sidebarData.user" />
    </UiSidebarFooter>

    <UiSidebarRail />
  </UiSidebar>
</template>

<style></style>
