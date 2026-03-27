import { BadgeHelpIcon, BellDotIcon, BoxesIcon, BugIcon, ComponentIcon, CreditCardIcon, LayoutDashboardIcon, ListTodoIcon, PaletteIcon, PictureInPicture2Icon, PodcastIcon, SettingsIcon, SquareUserRoundIcon, UserIcon, UsersIcon, WrenchIcon } from '@lucide/vue'

import type { NavGroup } from '@/components/app-sidebar/types'

export function useSidebar() {
  const settingsNavItems = [
    { title: 'Profile', url: '/settings/', icon: UserIcon },
    { title: 'Account', url: '/settings/account', icon: WrenchIcon },
    { title: 'Appearance', url: '/settings/appearance', icon: PaletteIcon },
    { title: 'Notifications', url: '/settings/notifications', icon: BellDotIcon },
    { title: 'Display', url: '/settings/display', icon: PictureInPicture2Icon },
  ]

  const navData = ref<NavGroup[]> ([
    {
      title: 'General',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Tasks', url: '/tasks', icon: ListTodoIcon },
        { title: 'Apps', url: '/apps', icon: BoxesIcon },
        { title: 'Users', url: '/users', icon: UsersIcon },
        { title: 'Ai Talk Example', url: '/ai-talk', icon: PodcastIcon },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: SquareUserRoundIcon,
          items: [
            { title: 'Sign In', url: '/auth/sign-in' },
            { title: 'Sign In(2 Col)', url: '/auth/sign-in-2' },
            { title: 'Sign Up', url: '/auth/sign-up' },
            { title: 'Forgot Password', url: '/auth/forgot-password' },
            { title: 'OTP', url: '/auth/otp' },
          ],
        },
        {
          title: 'Errors',
          icon: BugIcon,
          items: [
            { title: '401 | Unauthorized', url: '/errors/401' },
            { title: '403 | Forbidden', url: '/errors/403' },
            { title: '404 | Not Found', url: '/errors/404' },
            { title: '500 | Internal Server Error', url: '/errors/500' },
            { title: '503 | Maintenance Error', url: '/errors/503' },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        { title: 'Settings', items: settingsNavItems, icon: SettingsIcon },
        { title: 'Prop Components', url: '/prop-components', icon: ComponentIcon },
        { title: 'Help Center', url: '/help-center', icon: BadgeHelpIcon },
        { title: 'Outside Page(GitHub)', url: 'https://www.github.com/Whbbit1999/shadcn-vue-admin' },
      ],
    },
  ])

  const otherPages = ref<NavGroup[]>([
    {
      title: 'Other',
      items: [
        { title: 'Plans & Pricing', icon: CreditCardIcon, url: '/billing' },
      ],
    },
  ])

  return {
    navData,
    otherPages,
    settingsNavItems,
  }
}
