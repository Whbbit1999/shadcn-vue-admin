<script lang="ts" setup>
import type { TalkType } from './types'
import { cn } from '@/lib/utils'
import ReplyCopy from './reply-copy.vue'
import ReplyRefresh from './reply-refresh.vue'
import RobotAvatar from './robot-avatar.vue'
import ThumbDown from './thumb-down.vue'
import ThumbUp from './thumb-up.vue'

interface Props {
  content: string
  type: TalkType
}

defineProps<Props>()
</script>

<template>
  <div
    :class="cn(
      'text-popover-foreground w-fit flex',
      type === 'self' ? 'text-right ml-auto' : 'text-left mr-auto',
    )"
  >
    <RobotAvatar v-if="type !== 'self'" class="mt-2 mr-2" />
    <div>
      <p
        :class="cn(
          'p-4 rounded-lg bg-muted',
          type === 'self' ? 'bg-primary text-primary-foreground' : 'bg-secondary',
        )"
      >
        {{ content }}
      </p>
      <div v-if="type !== 'self'">
        <div class="flex items-center gap-2 mt-2">
          <ReplyCopy :content="content" />
          <ReplyRefresh />
          <ThumbUp />
          <ThumbDown />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
