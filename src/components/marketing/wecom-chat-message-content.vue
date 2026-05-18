<script setup lang="ts">
import { Download, ExternalLink, FileText } from 'lucide-vue-next'
import { computed } from 'vue'

import type { WeComChatMessage } from '@/services/types/marketing.type'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  message: WeComChatMessage
}>()

const mediaUrl = computed(() => props.message.media?.url || '')
const linkUrl = computed(() => props.message.link?.url || '')
const mediaName = computed(() => props.message.media?.filename || props.message.content_text || props.message.msgtype || 'Attachment')
const displayText = computed(() => {
  if (mediaUrl.value || linkUrl.value)
    return ''
  return props.message.content_text || '-'
})

function messageTypeLabel(message: WeComChatMessage) {
  if (message.msgtype === 'text')
    return ''
  return message.msgtype || 'message'
}

function formatBytes(value?: number | null) {
  if (!value)
    return ''

  const units = ['B', 'KB', 'MB', 'GB']
  let size = value
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}
</script>

<template>
  <div v-if="messageTypeLabel(message)" class="mb-1">
    <Badge variant="secondary">
      {{ messageTypeLabel(message) }}
    </Badge>
  </div>

  <a
    v-if="linkUrl"
    :href="linkUrl"
    target="_blank"
    rel="noreferrer"
    class="block min-w-[240px] max-w-[360px] overflow-hidden rounded-md border bg-background/70 text-left transition-colors hover:bg-accent/50"
  >
    <img
      v-if="message.link?.image_url"
      :src="message.link.image_url"
      :alt="message.link?.title || 'Link preview'"
      class="h-28 w-full object-cover"
      loading="lazy"
    >
    <div class="space-y-1 p-3">
      <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1 font-medium leading-snug">
          {{ message.link?.title || linkUrl }}
        </div>
        <ExternalLink class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      </div>
      <div v-if="message.link?.description" class="line-clamp-2 text-xs text-muted-foreground">
        {{ message.link.description }}
      </div>
      <div class="truncate text-xs text-primary">
        {{ linkUrl }}
      </div>
    </div>
  </a>

  <template v-else-if="mediaUrl">
    <a
      v-if="message.msgtype === 'image' || message.msgtype === 'emotion'"
      :href="mediaUrl"
      target="_blank"
      rel="noreferrer"
      class="block"
    >
      <img
        :src="mediaUrl"
        :alt="mediaName"
        class="max-h-[320px] max-w-full rounded-md object-contain"
        loading="lazy"
      >
    </a>

    <video
      v-else-if="message.msgtype === 'video'"
      class="max-h-[360px] max-w-full rounded-md"
      controls
      preload="metadata"
      :src="mediaUrl"
    />

    <audio
      v-else-if="message.msgtype === 'voice'"
      class="w-[260px] max-w-full"
      controls
      preload="metadata"
      :src="mediaUrl"
    />

    <div v-else class="flex min-w-[220px] max-w-[340px] items-center gap-3 rounded-md border bg-background/60 p-3 text-left">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <FileText class="size-5 text-muted-foreground" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate font-medium">
          {{ mediaName }}
        </div>
        <div class="text-xs text-muted-foreground">
          {{ formatBytes(message.media?.byte_size) || message.media?.fileext || 'File' }}
        </div>
      </div>
      <Button as-child variant="ghost" size="icon-sm">
        <a :href="mediaUrl" target="_blank" rel="noreferrer" :download="message.media?.filename || undefined">
          <Download class="size-4" />
        </a>
      </Button>
    </div>
  </template>

  <div v-else class="whitespace-pre-wrap break-words">
    {{ displayText }}
  </div>
</template>
