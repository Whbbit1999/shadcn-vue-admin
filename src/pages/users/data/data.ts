import { AwardIcon, BadgeDollarSignIcon, HandshakeIcon, ShieldIcon } from '@lucide/vue'
import { h } from 'vue'

import type { FacetedFilterOption } from '@/components/data-table'

import type { UserRole, UserStatus } from './schema'

export const callTypes = [
  {
    label: 'Active',
    value: 'active',
    style: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  },
  {
    label: 'Inactive',
    value: 'inactive',
    style: 'bg-neutral-300/40 border-neutral-300',
  },
  {
    label: 'Invited',
    value: 'invited',
    style: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  },
  {
    label: 'Suspended',
    value: 'suspended',
    style: 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  },
] satisfies (FacetedFilterOption<UserStatus> & { style: string })[]

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: h(BadgeDollarSignIcon),
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: h(HandshakeIcon),
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: h(AwardIcon),
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: h(ShieldIcon),
  },
] satisfies FacetedFilterOption<UserRole>[]
