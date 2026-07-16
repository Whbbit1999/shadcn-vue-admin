import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export type NavigationMode = 'collapsible' | 'vercel'

/**
 * Sidebar configuration store
 * Manages user preferences for sidebar navigation mode
 */
export const useSidebarConfigStore = defineStore(
  'sidebar-config',
  () => {
    const navigationMode = shallowRef<NavigationMode>('collapsible')

    function setNavigationMode(mode: NavigationMode) {
      navigationMode.value = mode
    }

    return {
      navigationMode,
      setNavigationMode,
    }
  },
  {
    persist: {
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
)
