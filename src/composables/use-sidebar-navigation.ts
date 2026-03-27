import { useSessionStorage } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { NavGroup, NavItem } from '@/components/app-sidebar/types'

/**
 * Composable for managing Vercel-style sidebar menu navigation
 * Handles menu state transitions between different menu levels
 */
export function useSidebarNavigation(navMain: Readonly<NavGroup[]>) {
  const route = useRoute()

  // Navigation path stack, e.g., ['Pages', 'Auth']
  const navigationPath = ref<string[]>([])

  // Session storage key for persisting navigation path
  const STORAGE_KEY = 'sidebar-nav-path'
  const savedNavigationPath = useSessionStorage(STORAGE_KEY, navigationPath.value)

  /**
   * Find a menu item by its path in the navigation hierarchy
   * Searches across all NavGroups to find the item
   */
  function findItemByPath(path: string[]): NavItem | null {
    if (path.length === 0)
      return null

    // First, find the initial item from any NavGroup
    const firstTitle = path[0]
    let current: any = null

    // Search in all NavGroups for the first level item
    for (const group of navMain as NavGroup[]) {
      const found = group.items.find((item: NavItem) => item.title === firstTitle)
      if (found) {
        if (path.length === 1)
          return found
        current = found
        break
      }
    }

    if (!current)
      return null

    // Continue traversing deeper levels
    for (let i = 1; i < path.length; i++) {
      const title = path[i]
      if (!current.items)
        return null

      const found = current.items.find((item: NavItem) => item.title === title)
      if (!found)
        return null
      if (i === path.length - 1)
        return found

      current = found
    }

    return current
  }

  /**
   * Get current menu items based on navigation path
   */
  const currentMenuItems = computed<any[]>(() => {
    if (navigationPath.value.length === 0) {
      // Root level: return first NavGroup's items
      return navMain[0]?.items || []
    }

    const parent = findItemByPath(navigationPath.value)
    return parent?.items || []
  })

  /**
   * Get current menu title for breadcrumb display
   */
  const currentMenuTitle = computed(() => {
    if (navigationPath.value.length === 0) {
      return navMain[0]?.title || ''
    }
    return navigationPath.value.at(-1) || ''
  })

  /**
   * Enter next level menu
   */
  function enterMenu(item: NavItem) {
    if (item.items && item.items.length > 0) {
      navigationPath.value.push(item.title)
      saveNavigationPath()
    }
  }

  /**
   * Go back to previous menu level
   */
  function goBack() {
    if (navigationPath.value.length > 0) {
      navigationPath.value.pop()
      saveNavigationPath()
    }
  }

  /**
   * Reset to root menu
   */
  function reset() {
    navigationPath.value = []
    clearNavigationPath()
  }

  /**
   * Get breadcrumb items for display
   */
  function getBreadcrumbs() {
    const breadcrumbs: Array<{ title: string, path: string[] }> = [
      { title: navMain[0]?.title || 'Home', path: [] },
    ]

    for (let i = 0; i < navigationPath.value.length; i++) {
      const path = navigationPath.value.slice(0, i + 1)
      breadcrumbs.push({
        title: path.at(-1) ?? '',
        path,
      })
    }

    return breadcrumbs
  }

  /**
   * Check if a menu item is currently active based on route
   */
  function isMenuItemActive(item: NavItem): boolean {
    const currentPath = route.path
    if (item.url) {
      return currentPath === item.url
    }
    if (item.items) {
      return item.items.some(subItem => isMenuItemActive(subItem as NavItem))
    }
    return false
  }

  /**
   * Save navigation path to sessionStorage
   */
  function saveNavigationPath() {
    savedNavigationPath.value = navigationPath.value
  }

  /**
   * Load navigation path from sessionStorage
   */
  function loadNavigationPath() {
    navigationPath.value = savedNavigationPath.value ?? []
  }

  /**
   * Clear navigation path from sessionStorage
   */
  function clearNavigationPath() {
    savedNavigationPath.value = []
  }

  // Restore navigation state on mount
  onMounted(() => {
    loadNavigationPath()
  })

  // Optionally clear navigation path when route changes to a leaf menu item
  // This prevents staying in a nested menu view when directly navigating to a page
  watch(
    () => route.path,
    () => {
      // Note: You could add logic here to auto-reset navigation when navigating to a page
      // For now, we keep the navigation state when route changes
    },
  )

  return {
    navigationPath,
    currentMenuItems,
    currentMenuTitle,
    enterMenu,
    goBack,
    reset,
    getBreadcrumbs,
    isMenuItemActive,
    saveNavigationPath,
    loadNavigationPath,
    clearNavigationPath,
  }
}
