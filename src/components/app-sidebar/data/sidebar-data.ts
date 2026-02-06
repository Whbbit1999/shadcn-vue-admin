import { useSidebar } from '@/composables/use-sidebar'

import type { SidebarData, Team, User } from '../types'

const user: User = {
  name: 'RAAS Admin',
  email: 'admin@raas.com',
  avatar: '/avatars/shadcn.jpg',
}

const teams: Team[] = []

const { navData } = useSidebar()

export const sidebarData: SidebarData = {
  user,
  teams,
  navMain: navData.value!,
}
