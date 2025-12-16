import type { Component } from 'vue'

export interface LayoutHeaderProps {
  title: string
  description: string
  sticky?: boolean
}

export interface TwoColAsideNavItem {
  title: string
  url: string
  icon?: Component
}
