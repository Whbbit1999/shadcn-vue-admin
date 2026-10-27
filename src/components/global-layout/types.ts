import type { Component } from 'vue'

export interface LayoutHeaderProps {
  title: string
  description: string
  sticky?: boolean
}

export interface TwoColAsideNavItem {
  /** Translation key of the label, for example `nav.settings.profile`. */
  titleKey: string
  url: string
  icon?: Component
}
