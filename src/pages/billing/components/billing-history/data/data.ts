import { CircleDashedIcon, CircleSlashIcon, ClockAlertIcon, HandCoinsIcon } from '@lucide/vue'

export const plans = [
  { value: 'basic', labelKey: 'billing.plan.basic.title' },
  { value: 'Small Business', labelKey: 'billing.plan.smallBusiness.title' },
  { value: 'Enterprise', labelKey: 'billing.plan.enterprise.title' },
]

export const statuses = [
  { value: 'paid', labelKey: 'billing.history.status.paid', icon: HandCoinsIcon, color: 'green' },
  { value: 'unpaid', labelKey: 'billing.history.status.unpaid', icon: CircleDashedIcon, color: 'orange' },
  { value: 'overdue', labelKey: 'billing.history.status.overdue', icon: ClockAlertIcon, color: 'red' },
  { value: 'cancelled', labelKey: 'billing.history.status.cancelled', icon: CircleSlashIcon, color: 'gray' },
]

export type PayState = 'paid' | 'unpaid' | 'overdue' | 'cancelled'
