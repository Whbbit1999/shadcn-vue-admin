import { AwardIcon, BadgeDollarSignIcon, HandshakeIcon, ShieldIcon } from '@lucide/vue'

import type { FacetedFilterOption } from '@/components/data-table'

import type { UserRole, UserStatus } from './schema'

export type LocalizedFacetedFilterOption<T extends string = string> = Omit<FacetedFilterOption<T>, 'label'> & {
  labelKey: string
}

export const callTypes = [
  {
    labelKey: 'users.status.active',
    value: 'active',
    style: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  },
  {
    labelKey: 'users.status.inactive',
    value: 'inactive',
    style: 'bg-neutral-300/40 border-neutral-300',
  },
  {
    labelKey: 'users.status.invited',
    value: 'invited',
    style: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  },
  {
    labelKey: 'users.status.suspended',
    value: 'suspended',
    style: 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  },
] satisfies (LocalizedFacetedFilterOption<UserStatus> & { style: string })[]

export const userTypes = [
  {
    labelKey: 'users.role.superadmin',
    value: 'superadmin',
    icon: BadgeDollarSignIcon,
  },
  {
    labelKey: 'users.role.admin',
    value: 'admin',
    icon: HandshakeIcon,
  },
  {
    labelKey: 'users.role.manager',
    value: 'manager',
    icon: AwardIcon,
  },
  {
    labelKey: 'users.role.cashier',
    value: 'cashier',
    icon: ShieldIcon,
  },
] satisfies LocalizedFacetedFilterOption<UserRole>[]
