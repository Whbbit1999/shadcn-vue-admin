<script setup lang="ts">
import { toast } from 'vue-sonner'

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
import { exampleTalks } from './data/talks'

const talks = shallowRef<IMessage[]>([...exampleTalks])
const isWaitingReply = shallowRef(false)

function pickReply(userContent: string): string {
  const lower = userContent.toLowerCase()

  if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi'))
    return 'Hello! I\'m your AI assistant. How can I help you? You can ask me questions, have me look up information, or we can discuss various topics together.'

  if (lower.includes('功能') || lower.includes('能力') || lower.includes('what can you do'))
    return 'I can help you with many things:\n\n- 💬 Answer knowledge questions\n- 📝 Assist with writing, translation, and summarization\n- 💻 Provide code examples and technical solutions\n- 🧠 Brainstorming and creative discussions\n- 📊 Data analysis and interpretation\n- 🌐 Real-time information lookup (online mode)\n\nLet me know what you need!'

  if (lower.includes('优点') || lower.includes('优势'))
    return 'My strengths include:\n\n✨ **Fast response** — handling your questions instantly\n✨ **Broad knowledge** — covering multiple domains\n✨ **Patient and thorough** — never tired of repeated questions\n✨ **24/7 availability** — here for you anytime, anywhere\n\nAnd I\'m constantly learning and improving!'

  if (lower.includes('缺点') || lower.includes('不足') || lower.includes('劣势'))
    return 'I also have some limitations:\n\n⚠️ My knowledge is current only up to my training data\n⚠️ I cannot perform real-world physical actions\n⚠️ Complex reasoning may occasionally have inaccuracies\n⚠️ I don\'t have genuine emotional experiences\n\nBut I\'m always evolving, thanks for your understanding! 🙏'

  if (lower.includes('weather') || lower.includes('天气'))
    return 'Sorry, I don\'t have access to real-time weather data at the moment. I suggest enabling web search mode or checking a weather app for the latest updates.'

  const defaults = [
    'That\'s a great question! Let me think... Here are a few angles to consider:\n\nFirst, from a technical perspective...\nSecond, from a practical standpoint...\nThird, from a future development view...\n\nWhich direction fits your needs best?',
    'Thanks for asking! 🙌 Let me share my thoughts:\n\nThis question covers multiple aspects. I suggest we explore it from the following dimensions. Of course, this is just my perspective — hope it sparks some ideas!',
    'Got your message! Let me quickly organize my thoughts:\n\n1️⃣ First, we need to clarify the core objective\n2️⃣ Then, analyze key influencing factors\n3️⃣ Finally, develop a feasible plan\n\nWhat do you think of this framework? We can discuss it further.',
    'That\'s an interesting topic! 🤔 Based on what I know:\n\nThere are several common approaches in the industry, each suited to different scenarios. The key is choosing the most appropriate solution based on your specific needs.\n\nWould you like me to elaborate on any particular direction?',
  ]

  return defaults[Math.floor(Math.random() * defaults.length)]
}

async function handleSubmit(content: string) {
  talks.value = [
    ...talks.value,
    { role: 'user', content },
  ]

  isWaitingReply.value = true
  const delay = 1000 + Math.random() * 2000
  await new Promise(resolve => setTimeout(resolve, delay))
  isWaitingReply.value = false

  const reply = pickReply(content)
  talks.value = [
    ...talks.value,
    { role: 'system', content: reply },
  ]
}

function handleTypeChange(type: string) {
  toast('type', {
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
            <UiAvatar v-else>
              <UiAvatarFallback>U</UiAvatarFallback>
            </UiAvatar>
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
                Thinking...
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
