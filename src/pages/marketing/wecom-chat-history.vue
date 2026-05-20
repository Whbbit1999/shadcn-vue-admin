<script setup lang="ts">
import type { DateValue } from 'reka-ui'

import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { RefreshCw, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import type { WeComChatThread, WeComChatThreadListParams } from '@/services/types/marketing.type'

import { BasicPage } from '@/components/global-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMarketingApi } from '@/services/api/marketing.api'

const router = useRouter()
const route = useRoute()
const activeTab = ref<'private' | 'group'>('private')
const isDetailRoute = computed(() => route.path !== '/marketing/wecom-chat-history')

const privatePagination = ref({ page: 1, pageSize: 20 })
const groupPagination = ref({ page: 1, pageSize: 20 })
const privatePageJump = ref('1')
const groupPageJump = ref('1')
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
const privateFilters = ref({
  thread_name: '',
  staff_userid: 'all',
  last_message_from: '',
  last_message_to: '',
})
const groupFilters = ref({
  thread_name: '',
  staff_userid: 'all',
  last_message_from: '',
  last_message_to: '',
})
const privateLastMessageFromCalendarOpen = ref(false)
const privateLastMessageToCalendarOpen = ref(false)
const groupLastMessageFromCalendarOpen = ref(false)
const groupLastMessageToCalendarOpen = ref(false)
const calendarPlaceholder = today(getLocalTimeZone())
const datePattern = /^\d{4}-\d{2}-\d{2}$/

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

const privateLastMessageFromCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(privateFilters.value.last_message_from),
  set: (value) => {
    privateFilters.value.last_message_from = value?.toString() ?? ''
  },
})

const privateLastMessageToCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(privateFilters.value.last_message_to),
  set: (value) => {
    privateFilters.value.last_message_to = value?.toString() ?? ''
  },
})

const groupLastMessageFromCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(groupFilters.value.last_message_from),
  set: (value) => {
    groupFilters.value.last_message_from = value?.toString() ?? ''
  },
})

const groupLastMessageToCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(groupFilters.value.last_message_to),
  set: (value) => {
    groupFilters.value.last_message_to = value?.toString() ?? ''
  },
})

const {
  useGetPrivateChatThreads,
  useGetGroupChatThreads,
} = useMarketingApi()

const privateParams = computed<WeComChatThreadListParams>(() => ({
  page: privatePagination.value.page,
  page_size: privatePagination.value.pageSize,
  thread_name: privateFilters.value.thread_name,
  staff_userid: privateFilters.value.staff_userid === 'all' ? undefined : privateFilters.value.staff_userid,
  last_message_from: dateParam(privateFilters.value.last_message_from),
  last_message_to: dateParam(privateFilters.value.last_message_to),
}))

const groupParams = computed<WeComChatThreadListParams>(() => ({
  page: groupPagination.value.page,
  page_size: groupPagination.value.pageSize,
  thread_name: groupFilters.value.thread_name,
  staff_userid: groupFilters.value.staff_userid === 'all' ? undefined : groupFilters.value.staff_userid,
  last_message_from: dateParam(groupFilters.value.last_message_from),
  last_message_to: dateParam(groupFilters.value.last_message_to),
}))

const privateQuery = useGetPrivateChatThreads(privateParams)
const groupQuery = useGetGroupChatThreads(groupParams)

watch(() => privatePagination.value.page, (page) => {
  privatePageJump.value = String(page)
})

watch(() => groupPagination.value.page, (page) => {
  groupPageJump.value = String(page)
})

watch(privateFilters, () => {
  privatePagination.value.page = 1
}, { deep: true })

watch(groupFilters, () => {
  groupPagination.value.page = 1
}, { deep: true })

function clearPrivateFilters() {
  privateFilters.value = {
    thread_name: '',
    staff_userid: 'all',
    last_message_from: '',
    last_message_to: '',
  }
}

function clearGroupFilters() {
  groupFilters.value = {
    thread_name: '',
    staff_userid: 'all',
    last_message_from: '',
    last_message_to: '',
  }
}

function formatMsgTime(value?: number | null) {
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

function openThread(thread: WeComChatThread) {
  if (thread.thread_type === 'private') {
    router.push({
      name: '/marketing/wecom-chat-history/private/[thread_id]',
      params: { thread_id: thread.thread_id },
    })
    return
  }

  router.push({
    name: '/marketing/wecom-chat-history/group/[roomid]',
    params: { roomid: thread.thread_id },
  })
}

function clampPage(value: number, totalPages: number) {
  if (!Number.isFinite(value))
    return 1
  return Math.min(Math.max(Math.trunc(value), 1), Math.max(totalPages, 1))
}

function jumpPrivatePage() {
  const totalPages = privateQuery.data.value?.total_pages ?? 1
  const page = clampPage(Number(privatePageJump.value), totalPages)
  privatePagination.value.page = page
  privatePageJump.value = String(page)
}

function jumpGroupPage() {
  const totalPages = groupQuery.data.value?.total_pages ?? 1
  const page = clampPage(Number(groupPageJump.value), totalPages)
  groupPagination.value.page = page
  groupPageJump.value = String(page)
}
</script>

<template>
  <RouterView v-if="isDetailRoute" />
  <BasicPage v-else title="WeCom Chat History" description="Archived private and group conversations" sticky>
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList>
        <TabsTrigger value="private">
          Private Chat
        </TabsTrigger>
        <TabsTrigger value="group">
          Group Chat
        </TabsTrigger>
      </TabsList>

      <TabsContent value="private">
        <Card>
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Private Chat Threads</CardTitle>
              <div class="flex items-center gap-2">
                <div class="text-sm text-muted-foreground">
                  {{ privateQuery.data.value?.total ?? 0 }} threads
                </div>
                <Button variant="outline" size="sm" :disabled="privateQuery.isFetching.value" @click="privateQuery.refetch()">
                  <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': privateQuery.isFetching.value }" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" @click="clearPrivateFilters">
                  <X class="mr-2 size-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="mb-4 grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_minmax(220px,1.2fr)_auto_auto] lg:items-end">
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Thread name
                </div>
                <Input v-model="privateFilters.thread_name" placeholder="Customer name or userid" />
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Apollo Staff Name
                </div>
                <Select v-model="privateFilters.staff_userid">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="All Apollo staffs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Apollo staffs
                    </SelectItem>
                    <SelectItem v-for="userid in staffOptions" :key="userid" :value="userid">
                      {{ userid }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Last message from
                </div>
                <Popover v-model:open="privateLastMessageFromCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="privateFilters.last_message_from"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="YYYY-MM-DD"
                      @click="privateLastMessageFromCalendarOpen = true"
                      @focus="privateLastMessageFromCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="privateLastMessageFromCalendarValue"
                      calendar-label="Private last message from"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="privateLastMessageFromCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Last message to
                </div>
                <Popover v-model:open="privateLastMessageToCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="privateFilters.last_message_to"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="YYYY-MM-DD"
                      @click="privateLastMessageToCalendarOpen = true"
                      @focus="privateLastMessageToCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="privateLastMessageToCalendarValue"
                      calendar-label="Private last message to"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="privateLastMessageToCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div class="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="min-w-[240px] text-center">
                      Thread
                    </TableHead>
                    <TableHead class="min-w-[180px] text-center">
                      Apollo Staff
                    </TableHead>
                    <TableHead class="min-w-[90px] text-center">
                      Messages
                    </TableHead>
                    <TableHead class="min-w-[120px] text-center">
                      Latest Type
                    </TableHead>
                    <TableHead class="min-w-[280px] text-center">
                      Latest Preview
                    </TableHead>
                    <TableHead class="min-w-[180px] text-center">
                      Latest Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="privateQuery.isLoading.value">
                    <TableCell colspan="6" class="h-28 text-center text-muted-foreground">
                      Loading private threads...
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="privateQuery.isError.value">
                    <TableCell colspan="6" class="h-28 text-center text-destructive">
                      Failed to load private threads.
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="(privateQuery.data.value?.items ?? []).length === 0">
                    <TableCell colspan="6" class="h-28 text-center text-muted-foreground">
                      No private chat threads found.
                    </TableCell>
                  </TableRow>
                  <TableRow v-for="thread in privateQuery.data.value?.items ?? []" v-else :key="thread.thread_id">
                    <TableCell>
                      <button class="text-left font-medium text-primary hover:underline" @click="openThread(thread)">
                        {{ thread.title }}
                      </button>
                      <div class="truncate text-xs text-muted-foreground">
                        {{ thread.thread_id }}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{{ thread.staff_userid || '-' }}</div>
                      <div class="text-xs text-muted-foreground">
                        {{ thread.external_userid || '-' }}
                      </div>
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      {{ thread.message_count }}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {{ thread.latest_msgtype || '-' }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="max-w-[360px] truncate">
                        {{ thread.latest_preview || '-' }}
                      </div>
                    </TableCell>
                    <TableCell>
                      {{ formatMsgTime(thread.latest_msgtime) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-muted-foreground">
                Page {{ privatePagination.page }} of {{ privateQuery.data.value?.total_pages ?? 1 }}
              </div>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" :disabled="privatePagination.page <= 1" @click="privatePagination.page -= 1">
                  Previous
                </Button>
                <div class="flex items-center gap-2">
                  <Input
                    v-model="privatePageJump"
                    class="h-8 w-16 text-center"
                    inputmode="numeric"
                    @keyup.enter="jumpPrivatePage"
                  />
                  <Button variant="outline" size="sm" @click="jumpPrivatePage">
                    Go
                  </Button>
                </div>
                <Button variant="outline" size="sm" :disabled="privatePagination.page >= (privateQuery.data.value?.total_pages ?? 1)" @click="privatePagination.page += 1">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="group">
        <Card>
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Group Chat Threads</CardTitle>
              <div class="flex items-center gap-2">
                <div class="text-sm text-muted-foreground">
                  {{ groupQuery.data.value?.total ?? 0 }} threads
                </div>
                <Button variant="outline" size="sm" :disabled="groupQuery.isFetching.value" @click="groupQuery.refetch()">
                  <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': groupQuery.isFetching.value }" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" @click="clearGroupFilters">
                  <X class="mr-2 size-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="mb-4 grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_minmax(220px,1.2fr)_auto_auto] lg:items-end">
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Thread name
                </div>
                <Input v-model="groupFilters.thread_name" placeholder="Group name or roomid" />
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Apollo Staff Name
                </div>
                <Select v-model="groupFilters.staff_userid">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="All Apollo staffs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Apollo staffs
                    </SelectItem>
                    <SelectItem v-for="userid in staffOptions" :key="userid" :value="userid">
                      {{ userid }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Last message from
                </div>
                <Popover v-model:open="groupLastMessageFromCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="groupFilters.last_message_from"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="YYYY-MM-DD"
                      @click="groupLastMessageFromCalendarOpen = true"
                      @focus="groupLastMessageFromCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="groupLastMessageFromCalendarValue"
                      calendar-label="Group last message from"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="groupLastMessageFromCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-medium text-muted-foreground">
                  Last message to
                </div>
                <Popover v-model:open="groupLastMessageToCalendarOpen">
                  <PopoverAnchor>
                    <Input
                      v-model="groupFilters.last_message_to"
                      class="w-[150px] text-left"
                      inputmode="numeric"
                      placeholder="YYYY-MM-DD"
                      @click="groupLastMessageToCalendarOpen = true"
                      @focus="groupLastMessageToCalendarOpen = true"
                    />
                  </PopoverAnchor>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="groupLastMessageToCalendarValue"
                      calendar-label="Group last message to"
                      initial-focus
                      layout="month-and-year"
                      :default-placeholder="calendarPlaceholder"
                      @update:model-value="groupLastMessageToCalendarOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div class="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="min-w-[260px] text-center">
                      Group
                    </TableHead>
                    <TableHead class="min-w-[140px] text-center">
                      Owner
                    </TableHead>
                    <TableHead class="min-w-[100px] text-center">
                      Members
                    </TableHead>
                    <TableHead class="min-w-[100px] text-center">
                      Messages
                    </TableHead>
                    <TableHead class="min-w-[120px] text-center">
                      Latest Type
                    </TableHead>
                    <TableHead class="min-w-[280px] text-center">
                      Latest Preview
                    </TableHead>
                    <TableHead class="min-w-[180px] text-center">
                      Latest Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="groupQuery.isLoading.value">
                    <TableCell colspan="7" class="h-28 text-center text-muted-foreground">
                      Loading group threads...
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="groupQuery.isError.value">
                    <TableCell colspan="7" class="h-28 text-center text-destructive">
                      Failed to load group threads.
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="(groupQuery.data.value?.items ?? []).length === 0">
                    <TableCell colspan="7" class="h-28 text-center text-muted-foreground">
                      No group chat threads found.
                    </TableCell>
                  </TableRow>
                  <TableRow v-for="thread in groupQuery.data.value?.items ?? []" v-else :key="thread.thread_id">
                    <TableCell>
                      <button class="text-left font-medium text-primary hover:underline" @click="openThread(thread)">
                        {{ thread.title }}
                      </button>
                      <div class="truncate text-xs text-muted-foreground">
                        {{ thread.roomid }}
                      </div>
                    </TableCell>
                    <TableCell>{{ thread.owner || '-' }}</TableCell>
                    <TableCell class="text-right tabular-nums">
                      {{ thread.member_count ?? 0 }}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      {{ thread.message_count }}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {{ thread.latest_msgtype || '-' }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="max-w-[360px] truncate">
                        {{ thread.latest_preview || '-' }}
                      </div>
                    </TableCell>
                    <TableCell>
                      {{ formatMsgTime(thread.latest_msgtime) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-muted-foreground">
                Page {{ groupPagination.page }} of {{ groupQuery.data.value?.total_pages ?? 1 }}
              </div>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" :disabled="groupPagination.page <= 1" @click="groupPagination.page -= 1">
                  Previous
                </Button>
                <div class="flex items-center gap-2">
                  <Input
                    v-model="groupPageJump"
                    class="h-8 w-16 text-center"
                    inputmode="numeric"
                    @keyup.enter="jumpGroupPage"
                  />
                  <Button variant="outline" size="sm" @click="jumpGroupPage">
                    Go
                  </Button>
                </div>
                <Button variant="outline" size="sm" :disabled="groupPagination.page >= (groupQuery.data.value?.total_pages ?? 1)" @click="groupPagination.page += 1">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: true
</route>
