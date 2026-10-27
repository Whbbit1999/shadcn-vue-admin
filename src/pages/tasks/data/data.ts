import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CircleCheckIcon, CircleHelpIcon, CircleIcon, CirclePlusIcon, TimerOffIcon } from '@lucide/vue'

import type { FacetedFilterOption } from '@/components/data-table'

type LocalizedFacetedFilterOption<T extends string = string> = Omit<FacetedFilterOption<T>, 'label'> & {
  labelKey: string
}

export const labels = [
  {
    value: 'bug',
    labelKey: 'tasks.label.bug',
  },
  {
    value: 'feature',
    labelKey: 'tasks.label.feature',
  },
  {
    value: 'documentation',
    labelKey: 'tasks.label.documentation',
  },
] satisfies LocalizedFacetedFilterOption[]

export const statuses = [
  {
    value: 'backlog',
    labelKey: 'tasks.status.backlog',
    icon: CircleHelpIcon,
  },
  {
    value: 'todo',
    labelKey: 'tasks.status.todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    labelKey: 'tasks.status.inProgress',
    icon: TimerOffIcon,
  },
  {
    value: 'done',
    labelKey: 'tasks.status.done',
    icon: CircleCheckIcon,
  },
  {
    value: 'canceled',
    labelKey: 'tasks.status.canceled',
    icon: CirclePlusIcon,
  },
] satisfies LocalizedFacetedFilterOption[]

export const priorities = [
  {
    value: 'low',
    labelKey: 'tasks.priority.low',
    icon: ArrowDownIcon,
  },
  {
    value: 'medium',
    labelKey: 'tasks.priority.medium',
    icon: ArrowRightIcon,
  },
  {
    value: 'high',
    labelKey: 'tasks.priority.high',
    icon: ArrowUpIcon,
  },
] satisfies LocalizedFacetedFilterOption[]
