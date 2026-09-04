import { CircleDashedIcon, CircleSlashIcon, ClockAlertIcon, HandCoinsIcon } from '@lucide/vue'

export const plans = [
  { value: 'basic', label: 'Basic' },
  { value: 'Small Business', label: 'Small Business' },
  { value: 'Enterprise', label: 'Enterprise' },
]

export const statuses = [
  { value: 'paid', label: 'Paid', icon: HandCoinsIcon, color: 'green' },
  { value: 'unpaid', label: 'Unpaid', icon: CircleDashedIcon, color: 'orange' },
  { value: 'overdue', label: 'Overdue', icon: ClockAlertIcon, color: 'red' },
  { value: 'cancelled', label: 'Cancelled', icon: CircleSlashIcon, color: 'gray' },
]

export type PayState = 'paid' | 'unpaid' | 'overdue' | 'cancelled'
