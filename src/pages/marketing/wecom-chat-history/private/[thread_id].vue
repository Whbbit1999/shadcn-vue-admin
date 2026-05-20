<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import type { WeComChatMessage } from '@/services/types/marketing.type'

import { BasicPage } from '@/components/global-layout'
import WeComChatMessageContent from '@/components/marketing/wecom-chat-message-content.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMarketingApi } from '@/services/api/marketing.api'

const route = useRoute()
const router = useRouter()
const { useGetPrivateChatMessages } = useMarketingApi()

const PAGE_SIZE = 100
const threadId = computed(() => String((route.params as Record<string, string | undefined>).thread_id || ''))
const page = ref(1)
const loadedMessages = ref<WeComChatMessage[]>([])
const messageParams = computed(() => ({ page: page.value, page_size: PAGE_SIZE }))
const { data, isLoading, isFetching, isError } = useGetPrivateChatMessages(threadId, messageParams)
const hasEarlierMessages = computed(() => !!data.value && page.value < data.value.total_pages)

watch(threadId, () => {
  page.value = 1
  loadedMessages.value = []
})

watch(data, (value) => {
  if (!value)
    return
  if (value.page === 1) {
    loadedMessages.value = value.items
    return
  }
  const existingIds = new Set(loadedMessages.value.map(message => message.msgid))
  loadedMessages.value = [
    ...value.items.filter(message => !existingIds.has(message.msgid)),
    ...loadedMessages.value,
  ]
})

function loadEarlierMessages() {
  if (hasEarlierMessages.value && !isFetching.value)
    page.value += 1
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
</script>

<template>
  <BasicPage :title="data?.thread.title || 'Private Chat'" :description="data?.thread.participant_summary || threadId" sticky>
    <div class="space-y-4">
      <Button variant="ghost" class="px-0" @click="router.push('/marketing/wecom-chat-history')">
        <ArrowLeft class="mr-2 size-4" />
        Back to chat threads
      </Button>

      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{{ data?.thread.title || 'Private Chat' }}</CardTitle>
            <div class="text-sm text-muted-foreground">
              {{ loadedMessages.length }} / {{ data?.total ?? 0 }} messages loaded
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="h-40 content-center text-center text-muted-foreground">
            Loading messages...
          </div>
          <div v-else-if="isError" class="h-40 content-center text-center text-destructive">
            Failed to load messages.
          </div>
          <div v-else class="space-y-4">
            <div v-if="hasEarlierMessages" class="flex justify-center">
              <Button variant="outline" size="sm" :disabled="isFetching" @click="loadEarlierMessages">
                {{ isFetching ? 'Loading earlier messages...' : 'Load earlier messages' }}
              </Button>
            </div>
            <div
              v-for="message in loadedMessages"
              :key="message.msgid"
              class="flex"
              :class="message.direction === 'outbound' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[72%] space-y-1"
                :class="message.direction === 'outbound' ? 'items-end text-right' : 'items-start text-left'"
              >
                <div class="text-xs text-muted-foreground">
                  {{ message.sender_display_name }} · {{ formatMsgTime(message.msgtime) }}
                </div>
                <div
                  class="rounded-lg border px-3 py-2 text-sm shadow-xs"
                  :class="message.direction === 'outbound' ? 'border-[#8fd26a] bg-[#95ec69] text-[#111827] dark:border-green-700/70 dark:bg-green-900/50 dark:text-green-50' : 'border-border bg-white text-foreground dark:bg-background'"
                >
                  <WeComChatMessageContent :message="message" />
                </div>
              </div>
            </div>
            <div v-if="loadedMessages.length === 0" class="h-40 content-center text-center text-muted-foreground">
              No messages found.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: true
</route>
