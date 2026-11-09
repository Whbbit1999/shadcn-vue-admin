<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { useSidebarConfigStore } from '@/stores/sidebar-config'

import { sidebarData } from './data/sidebar-data'
import NavFooter from './nav-footer.vue'
import NavTeam from './nav-team.vue'
import TeamSwitcher from './team-switcher.vue'

const { asideVariant } = storeToRefs(useSidebarConfigStore())
</script>

<template>
  <Sidebar :variant="asideVariant" collapsible="icon" class="z-50">
    <SidebarHeader class="border-b h-14 py-1 group-data-[collapsible=icon]:justify-center">
      <TeamSwitcher :teams="sidebarData.teams" />
    </SidebarHeader>

    <SidebarContent>
      <NavTeam :nav-main="sidebarData.navMain" />
    </SidebarContent>

    <SidebarFooter class="border-t h-14 py-1 group-data-[collapsible=icon]:justify-center">
      <NavFooter :user="sidebarData.user" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
