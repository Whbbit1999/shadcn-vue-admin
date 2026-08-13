<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

import { sidebarData } from './data/sidebar-data'
import NavFooter from './nav-footer.vue'
import NavTeam from './nav-team.vue'
import TeamSwitcher from './team-switcher.vue'
</script>

<template>
  <Sidebar collapsible="icon" class="z-50">
    <SidebarHeader>
      <TeamSwitcher :teams="sidebarData.teams" />
    </SidebarHeader>

    <SidebarContent>
      <NavTeam :nav-main="sidebarData.navMain" />
    </SidebarContent>

    <SidebarFooter>
      <NavFooter :user="sidebarData.user" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
