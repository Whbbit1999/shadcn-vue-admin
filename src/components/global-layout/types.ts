import type { Component } from 'vue'

export interface LayoutHeaderProps {
  title: string
  description: string
  sticky?: boolean
}

export interface TowColAsideNavItem {
  title: string
  url: string
  icon?: Component
}
