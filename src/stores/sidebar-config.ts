import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NavigationMode = 'collapsible' | 'vercel'

/**
 * Sidebar configuration store
 * Manages user preferences for sidebar navigation mode
 */
export const useSidebarConfigStore = defineStore(
  'sidebar-config',
  () => {
    const navigationMode = ref<NavigationMode>('collapsible')

    function setNavigationMode(mode: NavigationMode) {
      navigationMode.value = mode
    }

    return {
      navigationMode,
      setNavigationMode,
    }
  },
  {
    persist: true,
  },
)
