import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CircleCheckIcon, CircleHelpIcon, CircleIcon, CirclePlusIcon, TimerOffIcon } from '@lucide/vue'
import { h } from 'vue'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: h(CircleHelpIcon),
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: h(CircleIcon),
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: h(TimerOffIcon),
  },
  {
    value: 'done',
    label: 'Done',
    icon: h(CircleCheckIcon),
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: h(CirclePlusIcon),
  },
]

export const priorities = [
  {
    value: 'low',
    label: 'Low',
    icon: h(ArrowDownIcon),
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: h(ArrowRightIcon),
  },
  {
    value: 'high',
    label: 'High',
    icon: h(ArrowUpIcon),
  },
]
