import { useSessionStorage } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { NavGroup, NavItem, NavSubItem } from '@/components/app-sidebar/types'

/**
 * Composable for managing Vercel-style sidebar menu navigation
 * Handles menu state transitions between different menu levels
 */
export function useSidebarNavigation(navMain: Readonly<NavGroup[]>) {
  const route = useRoute()

  // Navigation path stack of title keys, e.g. ['nav.group.pages', 'nav.auth.title']
  const navigationPath = ref<string[]>([])

  // Session storage key for persisting navigation path
  const STORAGE_KEY = 'sidebar-nav-path'
  const savedNavigationPath = useSessionStorage(STORAGE_KEY, navigationPath.value)

  /**
   * Find a menu item by its path in the navigation hierarchy
   * Searches across all NavGroups to find the item
   */
  function findItemByPath(path: string[]): NavSubItem | null {
    if (path.length === 0)
      return null

    // First, find the initial item from any NavGroup
    const firstTitleKey = path[0]
    let current: NavSubItem | null = null

    // Search in all NavGroups for the first level item
    for (const group of navMain as NavGroup[]) {
      const found = group.items.find((item: NavItem) => item.titleKey === firstTitleKey)
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
      const titleKey = path[i]
      const items: NavSubItem[] | undefined = current?.items
      if (!items)
        return null

      const next: NavSubItem | undefined = items.find(item => item.titleKey === titleKey)
      if (!next)
        return null
      if (i === path.length - 1)
        return next

      current = next
    }

    return current
  }

  /**
   * Get current menu items based on navigation path
   */
  const currentMenuItems = computed<NavSubItem[]>(() => {
    if (navigationPath.value.length === 0) {
      // Root level: return first NavGroup's items
      return navMain[0]?.items || []
    }

    const parent = findItemByPath(navigationPath.value)
    return parent?.items || []
  })

  /**
   * Get the current menu title key for breadcrumb display
   */
  const currentMenuTitleKey = computed(() => {
    if (navigationPath.value.length === 0) {
      return navMain[0]?.titleKey || ''
    }
    return navigationPath.value.at(-1) || ''
  })

  /**
   * Enter next level menu
   */
  function enterMenu(item: NavSubItem) {
    if (item.items && item.items.length > 0) {
      navigationPath.value.push(item.titleKey)
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
    const breadcrumbs: Array<{ titleKey: string, path: string[] }> = [
      { titleKey: navMain[0]?.titleKey || 'nav.home', path: [] },
    ]

    for (let i = 0; i < navigationPath.value.length; i++) {
      const path = navigationPath.value.slice(0, i + 1)
      breadcrumbs.push({
        titleKey: path.at(-1) ?? '',
        path,
      })
    }

    return breadcrumbs
  }

  /**
   * Check if a menu item is currently active based on route
   */
  function isMenuItemActive(item: NavSubItem): boolean {
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

    // A saved path can become stale: keys are renamed, or an older version of
    // the app stored menu titles. Drop it instead of showing an empty menu.
    if (navigationPath.value.length > 0 && !findItemByPath(navigationPath.value)) {
      reset()
    }
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

  return {
    navigationPath,
    currentMenuItems,
    currentMenuTitleKey,
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
