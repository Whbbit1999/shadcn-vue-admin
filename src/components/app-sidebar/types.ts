import type { LucideProps } from '@lucide/vue'
import type { FunctionalComponent } from 'vue'

type NavIcon = FunctionalComponent<LucideProps, Record<any, any>, any, Record<any, any>>

interface BaseNavItem {
  title: string
  icon?: NavIcon
}

export type NavItem
  = | BaseNavItem & {
    items: NavSubItem[]
    url?: never
    isActive?: boolean
  } | BaseNavItem & {
    url: string
    items?: never
  }

/**
 * A navigation entry as exposed by `useSidebarNavigation()`.
 * Covers top-level items and nested sub-items (whose `url` is optional).
 */
export type NavSubItem = BaseNavItem & {
  url?: string
  items?: NavSubItem[]
  isActive?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface User {
  name: string
  avatar: string
  email: string
}

export interface Team {
  name: string
  logo: NavIcon
  plan: string
}

export interface SidebarData {
  user: User
  teams: Team[]
  navMain: NavGroup[]
}
