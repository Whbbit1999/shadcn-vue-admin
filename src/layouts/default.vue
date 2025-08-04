<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { storeToRefs } from 'pinia'

import AppSidebar from '@/components/app-sidebar/index.vue'
import CommandMenuPanel from '@/components/command-menu-panel/index.vue'
import ThemePopover from '@/components/custom-theme/theme-popover.vue'
import ToggleTheme from '@/components/toggle-theme.vue'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme'

const defaultOpen = useCookies(['sidebar:state'])
const themeStore = useThemeStore()
const { contentLayout } = storeToRefs(themeStore)
</script>

<template>
  <UiSidebarProvider :default-open="defaultOpen.get('sidebar:state')">
    <AppSidebar />
    <UiSidebarInset class="w-full max-w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]">
      <header
        class="flex items-center gap-3 sm:gap-4 h-16 p-4 shrink-0 transition-[width,height] ease-linear"
      >
        <UiSidebarTrigger class="-ml-1" />
        <UiSeparator orientation="vertical" class="h-6" />
        <CommandMenuPanel />
        <div class="ml-auto flex items-center space-x-4">
          <ToggleTheme />
          <ThemePopover />
        </div>
      </header>
      <div
        :class="cn(
          'p-4 grow',
          contentLayout === 'centered' ? 'container mx-auto ' : '',
        )"
      >
        <router-view />
      </div>
    </UiSidebarInset>
  </UiSidebarProvider>
</template>
