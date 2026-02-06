import { BarChart3, BellDot, Palette, PictureInPicture2, Settings, User, Wrench } from 'lucide-vue-next'

import type { NavGroup } from '@/components/app-sidebar/types'

export function useSidebar() {
  const settingsNavItems = [
    { title: 'Profile', url: '/settings/', icon: User },
    { title: 'Account', url: '/settings/account', icon: Wrench },
    { title: 'Appearance', url: '/settings/appearance', icon: Palette },
    { title: 'Notifications', url: '/settings/notifications', icon: BellDot },
    { title: 'Display', url: '/settings/display', icon: PictureInPicture2 },
  ]

  const navData = ref<NavGroup[]> ([
    {
      title: 'Dashboard',
      items: [
        { title: 'RAAS Dashboard', url: '/raas/dashboard', icon: BarChart3 },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Settings', icon: Settings, items: settingsNavItems },
      ],
    },
  ])

  const otherPages = ref<NavGroup[]>([])

  return {
    navData,
    otherPages,
    settingsNavItems,
  }
}
