<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { Message, MessageAvatar, MessageContent, MessageFooter } from '@/components/ui/message'
import { Spinner } from '@/components/ui/spinner'

import type { IMessage } from './types'

import ReplyCopy from './components/reply-copy.vue'
import ReplyRefresh from './components/reply-refresh.vue'
import RobotAvatar from './components/robot-avatar.vue'
import TalkFooter from './components/talk-footer.vue'
import ThumbDown from './components/thumb-down.vue'
import ThumbUp from './components/thumb-up.vue'
import { pickReply } from './data/replies'
import { exampleTalks } from './data/talks'

const { t } = useI18n()

const talks = shallowRef<IMessage[]>(exampleTalks.map(talk => ({
  role: talk.role,
  content: t(talk.contentKey),
})))
const isWaitingReply = shallowRef(false)

async function handleSubmit(content: string) {
  talks.value = [
    ...talks.value,
    { role: 'user', content },
  ]

  isWaitingReply.value = true
  const delay = 1000 + Math.random() * 2000
  await new Promise(resolve => setTimeout(resolve, delay))
  isWaitingReply.value = false

  const reply = pickReply(content, key => t(key))
  talks.value = [
    ...talks.value,
    { role: 'system', content: reply },
  ]
}

function handleTypeChange(type: string) {
  toast(t('aiTalk.toast.typeTitle'), {
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(type)),
    ),
  })
}
</script>

<template>
  <div class="flex flex-col overflow-hidden absolute inset-0">
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <div
        v-for="(talk, index) in talks"
        :key="index"
      >
        <Message :align="talk.role === 'user' ? 'end' : 'start'">
          <MessageAvatar>
            <RobotAvatar v-if="talk.role !== 'user'" />
            <Avatar v-else>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble :variant="talk.role === 'user' ? 'default' : 'secondary'">
              <BubbleContent>
                {{ talk.content }}
              </BubbleContent>
            </Bubble>
            <MessageFooter v-if="talk.role !== 'user'">
              <div class="flex items-center gap-1">
                <ReplyCopy :content="talk.content" />
                <ReplyRefresh />
                <ThumbUp />
                <ThumbDown />
              </div>
            </MessageFooter>
          </MessageContent>
        </Message>
      </div>

      <div v-if="isWaitingReply">
        <Message align="start">
          <MessageAvatar>
            <RobotAvatar />
          </MessageAvatar>
          <MessageContent>
            <Marker role="status">
              <MarkerIcon>
                <Spinner />
              </MarkerIcon>
              <MarkerContent class="shimmer">
                {{ $t('aiTalk.thinking') }}
              </MarkerContent>
            </Marker>
          </MessageContent>
        </Message>
      </div>
    </div>

    <div class="mx-2 mb-2">
      <TalkFooter
        class="sticky bottom-2 bg-background"
        @submit="handleSubmit"
        @type-change="handleTypeChange"
      />
    </div>
  </div>
</template>
