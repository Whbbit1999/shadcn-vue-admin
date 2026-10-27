import { BadgeHelpIcon, BellDotIcon, BirdIcon, BoxesIcon, BugIcon, ComponentIcon, CreditCardIcon, LayoutDashboardIcon, ListTodoIcon, PaletteIcon, PictureInPicture2Icon, PodcastIcon, SettingsIcon, SquareUserRoundIcon, UserIcon, UsersIcon, WrenchIcon } from '@lucide/vue'

import type { NavGroup, NavItem } from '@/components/app-sidebar/types'

type SidebarLink = Extract<NavItem, { url: string }>

export const settingsNavItems: SidebarLink[] = [
  { titleKey: 'nav.settings.profile', url: '/settings/', icon: UserIcon },
  { titleKey: 'nav.settings.account', url: '/settings/account', icon: WrenchIcon },
  { titleKey: 'nav.settings.appearance', url: '/settings/appearance', icon: PaletteIcon },
  { titleKey: 'nav.settings.notifications', url: '/settings/notifications', icon: BellDotIcon },
  { titleKey: 'nav.settings.display', url: '/settings/display', icon: PictureInPicture2Icon },
]

export const navData: NavGroup[] = [
  {
    titleKey: 'nav.group.general',
    items: [
      { titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
      { titleKey: 'nav.tasks', url: '/tasks', icon: ListTodoIcon },
      { titleKey: 'nav.apps', url: '/apps', icon: BoxesIcon },
      { titleKey: 'nav.users', url: '/users', icon: UsersIcon },
      { titleKey: 'nav.aiTalk', url: '/ai-talk', icon: PodcastIcon },
    ],
  },
  {
    titleKey: 'nav.group.pages',
    items: [
      {
        titleKey: 'nav.auth.title',
        icon: SquareUserRoundIcon,
        items: [
          { titleKey: 'nav.auth.signIn', url: '/auth/sign-in' },
          { titleKey: 'nav.auth.signIn2Col', url: '/auth/sign-in-2' },
          { titleKey: 'nav.auth.signUp', url: '/auth/sign-up' },
          { titleKey: 'nav.auth.forgotPassword', url: '/auth/forgot-password' },
          { titleKey: 'nav.auth.otp', url: '/auth/otp' },
        ],
      },
      {
        titleKey: 'nav.errorPages.title',
        icon: BugIcon,
        items: [
          { titleKey: 'nav.errorPages.unauthorized', url: '/errors/401' },
          { titleKey: 'nav.errorPages.forbidden', url: '/errors/403' },
          { titleKey: 'nav.errorPages.notFound', url: '/errors/404' },
          { titleKey: 'nav.errorPages.internalServerError', url: '/errors/500' },
          { titleKey: 'nav.errorPages.maintenance', url: '/errors/503' },
        ],
      },
    ],
  },
  {
    titleKey: 'nav.group.other',
    items: [
      { titleKey: 'nav.settings.title', items: settingsNavItems, icon: SettingsIcon },
      { titleKey: 'nav.propComponents', url: '/prop-components', icon: ComponentIcon },
      { titleKey: 'nav.helpCenter', url: '/help-center', icon: BadgeHelpIcon },
      { titleKey: 'nav.gitHub', url: 'https://www.github.com/Whbbit1999/shadcn-vue-admin', icon: BirdIcon },
    ],
  },
]

export const otherPages: NavGroup[] = [
  {
    titleKey: 'nav.group.other',
    items: [
      { titleKey: 'nav.pricingPlans', icon: CreditCardIcon, url: '/billing' },
    ],
  },
]
