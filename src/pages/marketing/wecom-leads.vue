<script setup lang="ts">
import type { DateValue } from 'reka-ui'

import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw, Settings2, Sparkles, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import type { WeComLead, WeComLeadListParams, WeComLeadTaggingTarget } from '@/services/types/marketing.type'

import { BasicPage } from '@/components/global-layout'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMarketingApi } from '@/services/api/marketing.api'

const staffOptions = [
  '19357117081',
  'apollo_captain',
  'apollo-nasa',
  '19357694505',
  '19357106882',
  '19357119703',
  'apollo_spark',
  'apollo2',
  '19357635821',
]

const filters = ref({
  search: '',
  chat_type: 'all',
  salesperson: 'all',
  status: 'all',
  last_message_from: '',
  last_message_to: '',
})
const pagination = ref({ page: 1, pageSize: 20 })
const pageJump = ref('1')
const lastMessageFromCalendarOpen = ref(false)
const lastMessageToCalendarOpen = ref(false)
const fullRunDialogOpen = ref(false)
const selectedLeadMap = ref<Record<string, WeComLeadTaggingTarget>>({})
const sorting = ref<{ sortBy: WeComLeadListParams['sort_by'], sortDir: 'asc' | 'desc' }>({
  sortBy: 'last_messaged',
  sortDir: 'desc',
})
const calendarPlaceholder = today(getLocalTimeZone())
const datePattern = /^\d{4}-\d{2}-\d{2}$/

const {
  useGetWeComLeads,
  useGetWeComLeadPrompts,
  useGetWeComLeadLatestJob,
  useTriggerWeComLeadTaggingJob,
} = useMarketingApi()

const defaultColumnWidths: Record<string, number> = {
  select: 44,
  contact: 240,
  salesperson: 240,
  chatType: 140,
  apolloMessages: 150,
  replies: 130,
  lastMessaged: 170,
  qualityScore: 125,
  conversation: 140,
}
const columnWidths = ref<Record<string, number>>({ ...defaultColumnWidths })
const resizingColumn = ref<string | null>(null)
let resizeStartX = 0
let resizeStartWidth = 0

function dateParam(value: string) {
  const trimmed = value.trim()
  return datePattern.test(trimmed) ? trimmed : undefined
}

function calendarDate(value: string) {
  const trimmed = value.trim()
  if (!datePattern.test(trimmed))
    return undefined

  try {
    return parseDate(trimmed)
  }
  catch {
    return undefined
  }
}

const lastMessageFromCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(filters.value.last_message_from),
  set: (value) => {
    filters.value.last_message_from = value?.toString() ?? ''
  },
})

const lastMessageToCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(filters.value.last_message_to),
  set: (value) => {
    filters.value.last_message_to = value?.toString() ?? ''
  },
})

const leadParams = computed<WeComLeadListParams>(() => ({
  page: pagination.value.page,
  page_size: pagination.value.pageSize,
  search: filters.value.search,
  chat_type: filters.value.chat_type === 'all' ? undefined : filters.value.chat_type,
  salesperson: filters.value.salesperson === 'all' ? undefined : filters.value.salesperson,
  status: filters.value.status === 'all' ? undefined : filters.value.status,
  last_message_from: dateParam(filters.value.last_message_from),
  last_message_to: dateParam(filters.value.last_message_to),
  sort_by: sorting.value.sortBy,
  sort_dir: sorting.value.sortDir,
}))

const leadsQuery = useGetWeComLeads(leadParams)
const promptsQuery = useGetWeComLeadPrompts()
const latestJobQuery = useGetWeComLeadLatestJob()
const triggerJobMutation = useTriggerWeComLeadTaggingJob()

watch(filters, () => {
  pagination.value.page = 1
}, { deep: true })

watch(() => pagination.value.page, (page) => {
  pageJump.value = String(page)
})

watch(sorting, () => {
  pagination.value.page = 1
}, { deep: true })

const manualDisabled = computed(() => {
  return triggerJobMutation.isPending.value || !latestJobQuery.data.value?.manual_allowed
})

const salesTagRules = computed(() => promptsQuery.data.value?.tag_rules ?? [])
const currentLeads = computed(() => leadsQuery.data.value?.items ?? [])
const selectedLeads = computed(() => Object.values(selectedLeadMap.value))
const selectedCount = computed(() => selectedLeads.value.length)
const currentPageSelectedCount = computed(() => currentLeads.value.filter(lead => isLeadSelected(lead)).length)
const currentPageSelectionState = computed(() => {
  if (currentLeads.value.length > 0 && currentPageSelectedCount.value === currentLeads.value.length)
    return true
  if (currentPageSelectedCount.value > 0)
    return 'indeterminate'
  return false
})

const visibleColumnIds = computed(() => [
  'select',
  'contact',
  'salesperson',
  'chatType',
  'apolloMessages',
  'replies',
  'lastMessaged',
  ...salesTagRules.value.map(rule => `tag:${rule.id}`),
  'qualityScore',
  'conversation',
])

const tableWidth = computed(() => {
  return visibleColumnIds.value.reduce((total, columnId) => total + columnWidth(columnId), 0)
})

function clampPage(value: number, totalPages: number) {
  if (!Number.isFinite(value))
    return 1
  return Math.min(Math.max(Math.trunc(value), 1), Math.max(totalPages, 1))
}

function jumpPage() {
  const totalPages = leadsQuery.data.value?.total_pages ?? 1
  const page = clampPage(Number(pageJump.value), totalPages)
  pagination.value.page = page
  pageJump.value = String(page)
}

function clearFilters() {
  filters.value = {
    search: '',
    chat_type: 'all',
    salesperson: 'all',
    status: 'all',
    last_message_from: '',
    last_message_to: '',
  }
}

function leadKey(lead: WeComLead) {
  return `${lead.thread_type}:${lead.thread_id}`
}

function leadTarget(lead: WeComLead): WeComLeadTaggingTarget {
  return {
    thread_type: lead.thread_type,
    thread_id: lead.thread_id,
  }
}

function isLeadSelected(lead: WeComLead) {
  return !!selectedLeadMap.value[leadKey(lead)]
}

function setLeadSelected(lead: WeComLead, checked: boolean | 'indeterminate') {
  const next = { ...selectedLeadMap.value }
  const key = leadKey(lead)
  if (checked === true)
    next[key] = leadTarget(lead)
  else
    delete next[key]
  selectedLeadMap.value = next
}

function setCurrentPageSelected(checked: boolean | 'indeterminate') {
  const next = { ...selectedLeadMap.value }
  for (const lead of currentLeads.value) {
    const key = leadKey(lead)
    if (checked === true)
      next[key] = leadTarget(lead)
    else
      delete next[key]
  }
  selectedLeadMap.value = next
}

function clearSelectedLeads() {
  selectedLeadMap.value = {}
}

function toggleSort(sortBy: NonNullable<WeComLeadListParams['sort_by']>) {
  if (sorting.value.sortBy === sortBy) {
    sorting.value.sortDir = sorting.value.sortDir === 'asc' ? 'desc' : 'asc'
    return
  }
  sorting.value = { sortBy, sortDir: 'desc' }
}

function sortIcon(sortBy: NonNullable<WeComLeadListParams['sort_by']>) {
  if (sorting.value.sortBy !== sortBy)
    return ArrowUpDown
  return sorting.value.sortDir === 'asc' ? ArrowUp : ArrowDown
}

function formatDateTime(value?: string | null) {
  if (!value)
    return '-'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function jsonPreview(value: unknown) {
  if (!value)
    return '-'
  if (typeof value === 'string')
    return value
  return JSON.stringify(value)
}

function prettyJsonPreview(value: unknown) {
  if (!value)
    return '-'
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    }
    catch {
      return value
    }
  }
  return JSON.stringify(value, null, 2)
}

function conciseValue(value: unknown, limit = 160) {
  const text = jsonPreview(value)
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

function statusVariant(status: string) {
  if (status === 'complete')
    return 'default'
  if (status === 'failed')
    return 'destructive'
  return 'secondary'
}

function triggerTagging() {
  if (selectedCount.value > 0) {
    triggerJobMutation.mutate(
      { selected_leads: selectedLeads.value },
      { onSuccess: clearSelectedLeads },
    )
    return
  }
  fullRunDialogOpen.value = true
}

function confirmFullTagging() {
  triggerJobMutation.mutate(
    {},
    {
      onSuccess: () => {
        fullRunDialogOpen.value = false
      },
    },
  )
}

function getSalesTagValue(lead: WeComLead, tagName: string) {
  return lead.tag_values?.[tagName] ?? null
}

function columnWidth(columnId: string) {
  if (columnWidths.value[columnId])
    return columnWidths.value[columnId]
  if (columnId.startsWith('tag:'))
    return 220
  return 160
}

function columnStyle(columnId: string) {
  const width = `${columnWidth(columnId)}px`
  return { width, minWidth: width, maxWidth: width }
}

function pinnedLeftStyle(columnId: string) {
  const left = columnId === 'contact' ? `${columnWidth('select')}px` : '0px'
  return {
    ...columnStyle(columnId),
    left,
  }
}

function pinnedRightStyle(columnId: string) {
  return {
    ...columnStyle(columnId),
    right: '0px',
  }
}

function onColumnResizeMove(event: MouseEvent) {
  if (!resizingColumn.value)
    return
  const nextWidth = Math.max(90, resizeStartWidth + event.clientX - resizeStartX)
  columnWidths.value = {
    ...columnWidths.value,
    [resizingColumn.value]: nextWidth,
  }
}

function stopColumnResize() {
  resizingColumn.value = null
  document.removeEventListener('mousemove', onColumnResizeMove)
  document.removeEventListener('mouseup', stopColumnResize)
}

function startColumnResize(event: MouseEvent, columnId: string) {
  event.preventDefault()
  resizingColumn.value = columnId
  resizeStartX = event.clientX
  resizeStartWidth = columnWidth(columnId)
  document.addEventListener('mousemove', onColumnResizeMove)
  document.addEventListener('mouseup', stopColumnResize)
}

onBeforeUnmount(stopColumnResize)
</script>

<template>
  <BasicPage title="WeCom Leads" description="LLM-assisted sales tagging for WeCom conversations" sticky>
    <div class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Filters</CardTitle>
            <div class="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" :disabled="leadsQuery.isFetching.value" @click="leadsQuery.refetch()">
                <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': leadsQuery.isFetching.value }" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" @click="clearFilters">
                <X class="mr-2 size-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div class="space-y-1.5 xl:col-span-2">
              <div class="text-xs font-medium text-muted-foreground">
                Thread name
              </div>
              <Input v-model="filters.search" placeholder="Name, userid, roomid" />
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Chat type
              </div>
              <Select v-model="filters.chat_type">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All
                  </SelectItem>
                  <SelectItem value="private">
                    Direct Messages
                  </SelectItem>
                  <SelectItem value="group">
                    Group Chat
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5 xl:col-span-2">
              <div class="text-xs font-medium text-muted-foreground">
                Apollo Staff
              </div>
              <Select v-model="filters.salesperson">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All staffs
                  </SelectItem>
                  <SelectItem v-for="userid in staffOptions" :key="userid" :value="userid">
                    {{ userid }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Status
              </div>
              <Select v-model="filters.status">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All
                  </SelectItem>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem value="complete">
                    Complete
                  </SelectItem>
                  <SelectItem value="failed">
                    Failed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5 xl:col-span-2">
              <div class="text-xs font-medium text-muted-foreground">
                Last message time
              </div>
              <div class="flex flex-wrap gap-2">
                <Popover v-model:open="lastMessageFromCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="filters.last_message_from"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="From"
                      @click="lastMessageFromCalendarOpen = true"
                      @focus="lastMessageFromCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="lastMessageFromCalendarValue"
                      calendar-label="Last message from"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="lastMessageFromCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
                <Popover v-model:open="lastMessageToCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="filters.last_message_to"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="To"
                      @click="lastMessageToCalendarOpen = true"
                      @focus="lastMessageToCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="lastMessageToCalendarValue"
                      calendar-label="Last message to"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="lastMessageToCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <div class="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <CardTitle>WeCom Leads</CardTitle>
                <Button as-child variant="outline" size="sm">
                  <RouterLink to="/marketing/prompt-editor">
                    <Settings2 class="mr-2 size-4" />
                    Prompt Editor
                  </RouterLink>
                </Button>
                <Button size="sm" :disabled="manualDisabled" @click="triggerTagging">
                  <Sparkles class="mr-2 size-4" />
                  {{ selectedCount > 0 ? `Run LLM Tagging (${selectedCount})` : 'Run LLM Tagging' }}
                </Button>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Latest job: {{ latestJobQuery.data.value?.latest_run?.status || 'none' }}
                  · {{ formatDateTime(latestJobQuery.data.value?.latest_run?.started_at) }}
                </span>
                <span v-if="!latestJobQuery.data.value?.manual_allowed && latestJobQuery.data.value?.cooldown_until">
                  Manual trigger cooldown until {{ formatDateTime(latestJobQuery.data.value.cooldown_until) }}.
                </span>
              </div>
              <div v-if="selectedCount > 0" class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{{ selectedCount }} leads selected for targeted tagging.</span>
                <Button variant="ghost" size="sm" class="h-7 px-2" @click="clearSelectedLeads">
                  Clear selection
                </Button>
              </div>
            </div>
            <div class="text-sm text-muted-foreground">
              {{ leadsQuery.data.value?.total ?? 0 }} leads
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="leads-table-frame rounded-md border">
            <table class="leads-table w-full caption-bottom table-fixed border-separate border-spacing-0 text-sm" :style="{ width: `${tableWidth}px`, minWidth: '100%' }">
              <thead class="[&_tr]:border-b">
                <tr>
                  <th class="sticky-table-head sticky-left-cell z-40 text-center" :style="pinnedLeftStyle('select')">
                    <Checkbox
                      :model-value="currentPageSelectionState"
                      :disabled="currentLeads.length === 0"
                      aria-label="Select current page leads"
                      @update:model-value="setCurrentPageSelected"
                    />
                  </th>
                  <th class="sticky-table-head sticky-left-cell z-30" :style="pinnedLeftStyle('contact')">
                    <div class="truncate px-2 text-center">
                      Contact
                    </div>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'contact')" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('salesperson')">
                    <div class="truncate px-2 text-center">
                      Salesperson
                    </div>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'salesperson')" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('chatType')">
                    <div class="truncate px-2 text-center">
                      Chat Type
                    </div>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'chatType')" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('apolloMessages')">
                    <button class="inline-flex w-full items-center justify-center gap-1 truncate px-2" type="button" @click="toggleSort('apollo_messages')">
                      Apollo Msgs
                      <component :is="sortIcon('apollo_messages')" class="size-3.5 shrink-0" />
                    </button>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'apolloMessages')" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('replies')">
                    <button class="inline-flex w-full items-center justify-center gap-1 truncate px-2" type="button" @click="toggleSort('replies')">
                      Replies
                      <component :is="sortIcon('replies')" class="size-3.5 shrink-0" />
                    </button>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'replies')" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('lastMessaged')">
                    <button class="inline-flex w-full items-center justify-center gap-1 truncate px-2" type="button" @click="toggleSort('last_messaged')">
                      Last Messaged
                      <component :is="sortIcon('last_messaged')" class="size-3.5 shrink-0" />
                    </button>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'lastMessaged')" />
                  </th>
                  <th v-for="rule in salesTagRules" :key="rule.id" class="sticky-table-head" :style="columnStyle(`tag:${rule.id}`)">
                    <div class="truncate px-2 text-center" :title="rule.tag_name">
                      {{ rule.tag_name }}
                    </div>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, `tag:${rule.id}`)" />
                  </th>
                  <th class="sticky-table-head" :style="columnStyle('qualityScore')">
                    <button class="inline-flex w-full items-center justify-center gap-1 truncate px-2" type="button" @click="toggleSort('score')">
                      Score
                      <component :is="sortIcon('score')" class="size-3.5 shrink-0" />
                    </button>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'qualityScore')" />
                  </th>
                  <th class="sticky-table-head sticky-right-cell z-30" :style="pinnedRightStyle('conversation')">
                    <div class="truncate px-2 text-center">
                      Conversation
                    </div>
                    <button class="column-resize-handle" type="button" @mousedown="startColumnResize($event, 'conversation')" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="leadsQuery.isLoading.value">
                  <td :colspan="visibleColumnIds.length" class="h-28 text-center text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
                <tr v-else-if="leadsQuery.isError.value">
                  <td :colspan="visibleColumnIds.length" class="h-28 text-center text-destructive">
                    Failed to load leads.
                  </td>
                </tr>
                <tr v-else-if="(leadsQuery.data.value?.items ?? []).length === 0">
                  <td :colspan="visibleColumnIds.length" class="h-28 text-center text-muted-foreground">
                    No leads found.
                  </td>
                </tr>
                <tr v-for="lead in leadsQuery.data.value?.items ?? []" v-else :key="`${lead.thread_type}:${lead.thread_id}`">
                  <td class="sticky-left-cell z-30 text-center" :style="pinnedLeftStyle('select')">
                    <Checkbox
                      :model-value="isLeadSelected(lead)"
                      :aria-label="`Select ${lead.contact_name}`"
                      @update:model-value="checked => setLeadSelected(lead, checked)"
                    />
                  </td>
                  <td class="sticky-left-cell z-20" :style="pinnedLeftStyle('contact')">
                    <div class="truncate font-medium" :title="lead.contact_name">
                      {{ lead.contact_name }}
                    </div>
                    <div class="truncate text-xs text-muted-foreground" :title="lead.external_userid || lead.thread_id">
                      {{ lead.external_userid || lead.thread_id }}
                    </div>
                    <Badge class="mt-1" :variant="statusVariant(lead.status)">
                      {{ lead.status }}
                    </Badge>
                  </td>
                  <td :style="columnStyle('salesperson')">
                    <div class="truncate" :title="lead.salesperson_userids.join(', ')">
                      {{ lead.salesperson_userids.join(', ') || '-' }}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      Added {{ lead.date_added || '-' }}
                    </div>
                  </td>
                  <td :style="columnStyle('chatType')">
                    <div class="truncate">
                      {{ lead.chat_type_label }}
                    </div>
                  </td>
                  <td class="text-right tabular-nums" :style="columnStyle('apolloMessages')">
                    {{ lead.apollo_message_count }}
                  </td>
                  <td class="text-right tabular-nums" :style="columnStyle('replies')">
                    {{ lead.customer_reply_count }}
                  </td>
                  <td :style="columnStyle('lastMessaged')">
                    <div class="truncate">
                      {{ lead.last_messaged || '-' }}
                    </div>
                  </td>
                  <td v-for="rule in salesTagRules" :key="`${lead.thread_type}:${lead.thread_id}:tag:${rule.id}`" :style="columnStyle(`tag:${rule.id}`)">
                    <TooltipProvider :delay-duration="150">
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <div class="line-clamp-3 cursor-default text-xs leading-5">
                            {{ conciseValue(getSalesTagValue(lead, rule.tag_name)) }}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          class="max-h-[420px] max-w-[520px] overflow-auto border bg-background p-3 text-foreground shadow-lg"
                        >
                          <pre class="whitespace-pre-wrap break-words font-mono text-xs leading-5">{{ prettyJsonPreview(getSalesTagValue(lead, rule.tag_name)) }}</pre>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td class="text-right tabular-nums" :style="columnStyle('qualityScore')">
                    {{ lead.quality_score ?? '-' }}
                  </td>
                  <td class="sticky-right-cell z-20" :style="pinnedRightStyle('conversation')">
                    <RouterLink class="text-primary hover:underline" :to="lead.conversation_path">
                      Open chat
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-muted-foreground">
              Page {{ pagination.page }} of {{ leadsQuery.data.value?.total_pages ?? 1 }}
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" :disabled="pagination.page <= 1" @click="pagination.page -= 1">
                Previous
              </Button>
              <Input v-model="pageJump" class="h-8 w-16 text-center" inputmode="numeric" @keyup.enter="jumpPage" />
              <Button variant="outline" size="sm" @click="jumpPage">
                Go
              </Button>
              <Button variant="outline" size="sm" :disabled="pagination.page >= (leadsQuery.data.value?.total_pages ?? 1)" @click="pagination.page += 1">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <AlertDialog v-model:open="fullRunDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run tagging for all leads?</AlertDialogTitle>
          <AlertDialogDescription>
            No leads are selected, so this will run LLM tagging for all eligible WeCom leads. This can take 2+ hours and will consume LLM quota. Select specific rows first if you only want to retag part of the table.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="triggerJobMutation.isPending.value">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction :disabled="triggerJobMutation.isPending.value" @click="confirmFullTagging">
            Confirm full run
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </BasicPage>
</template>

<style scoped>
.leads-table-frame {
  max-width: 100%;
  max-height: calc(100vh - 340px);
  overflow: auto;
  isolation: isolate;
}

.leads-table th {
  height: 2.5rem;
  padding: 0.5rem;
  font-weight: 500;
  color: var(--foreground);
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

.leads-table td {
  padding: 0.5rem;
  vertical-align: middle;
  white-space: nowrap;
}

.leads-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--border);
}

.sticky-table-head {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--background);
  box-shadow: inset 0 -1px 0 var(--border);
}

.sticky-table-head.sticky-left-cell,
.sticky-table-head.sticky-right-cell {
  z-index: 50;
}

.sticky-table-head.sticky-left-cell {
  box-shadow:
    inset -1px 0 0 var(--border),
    inset 0 -1px 0 var(--border);
}

.sticky-table-head.sticky-right-cell {
  box-shadow:
    inset 1px 0 0 var(--border),
    inset 0 -1px 0 var(--border);
}

.sticky-left-cell {
  position: sticky;
  left: 0;
  z-index: 20;
  background: var(--background);
  background-clip: padding-box;
  box-shadow: inset -1px 0 0 var(--border);
}

.sticky-right-cell {
  position: sticky;
  right: 0;
  z-index: 20;
  background: var(--background);
  background-clip: padding-box;
  box-shadow: inset 1px 0 0 var(--border);
}

.column-resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
}

.column-resize-handle::after {
  position: absolute;
  top: 25%;
  right: 3px;
  width: 1px;
  height: 50%;
  content: '';
  background: var(--border);
  opacity: 0;
  transition: opacity 120ms ease;
}

.column-resize-handle:hover::after {
  opacity: 1;
}
</style>

<route lang="yml">
meta:
  auth: true
</route>
