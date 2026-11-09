import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

import type { SidebarProps } from '@/components/ui/sidebar'

export type NavigationMode = 'collapsible' | 'vercel'

/**
 * Sidebar configuration store
 * Manages user preferences for sidebar navigation mode
 */
export const useSidebarConfigStore = defineStore(
  'sidebar-config',
  () => {
    const navigationMode = shallowRef<NavigationMode>('collapsible')
    const asideVariant = shallowRef<NonNullable<SidebarProps['variant']>>('sidebar')

    function setAsideVariant(variant: NonNullable<SidebarProps['variant']>) {
      asideVariant.value = variant
    }

    function setNavigationMode(mode: NavigationMode) {
      navigationMode.value = mode
    }

    return {
      navigationMode,
      setNavigationMode,
      asideVariant,
      setAsideVariant,
    }
  },
  {
    persist: {
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
)
