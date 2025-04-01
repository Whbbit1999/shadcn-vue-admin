<script setup lang="ts">
import AppSidebar from '@/components/app-sidebar/index.vue'
import CommandMenuPanel from '@/components/command-menu-panel/index.vue'
// import ThemePopover from '@/components/custom-theming/theme-popover.vue'
import ToggleTheme from '@/components/toggle-theme.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center w-full gap-1 px-4">
          <SidebarTrigger class="-ml-1" />
          <CommandMenuPanel />
          <div class="grow min-w-0" />
          <ToggleTheme />
          <!-- <ThemePopover /> -->
        </div>
      </header>
      <div
        class="flex flex-col flex-1 gap-4 p-4 pt-0"
      >
        <router-view />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
