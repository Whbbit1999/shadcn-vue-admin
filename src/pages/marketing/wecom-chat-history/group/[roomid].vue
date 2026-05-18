<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed } from 'vue'

import { BasicPage } from '@/components/global-layout'
import WeComChatMessageContent from '@/components/marketing/wecom-chat-message-content.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMarketingApi } from '@/services/api/marketing.api'

const route = useRoute()
const router = useRouter()
const { useGetGroupChatMessages } = useMarketingApi()

const roomid = computed(() => String((route.params as Record<string, string | undefined>).roomid || ''))
const { data, isLoading, isError } = useGetGroupChatMessages(roomid)

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
  <BasicPage :title="data?.thread.title || 'Group Chat'" :description="data?.thread.participant_summary || roomid" sticky>
    <div class="space-y-4">
      <Button variant="ghost" class="px-0" @click="router.push('/marketing/wecom-chat-history')">
        <ArrowLeft class="mr-2 size-4" />
        Back to chat threads
      </Button>

      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{{ data?.thread.title || 'Group Chat' }}</CardTitle>
            <div class="text-sm text-muted-foreground">
              {{ data?.total ?? 0 }} messages
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
            <div
              v-for="message in data?.items ?? []"
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
            <div v-if="(data?.items ?? []).length === 0" class="h-40 content-center text-center text-muted-foreground">
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
