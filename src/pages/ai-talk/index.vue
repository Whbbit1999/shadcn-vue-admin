<script lang="ts" setup>
import { toast } from 'vue-sonner'

import type { IMessage } from './types'

import TalkFooter from './components/talk-footer.vue'
import TalkList from './components/talk-list.vue'
import { exampleTalks } from './data/talks'

const talks = ref<IMessage[]>(exampleTalks)

function handleSubmit(content: string) {
  talks.value.push({
    role: 'user',
    content,
  })
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
  <div class="h-full">
    <div class="flex flex-col h-full">
      <main class="flex-1 overflow-y-auto">
        <TalkList :talks="talks" />
      </main>
      <TalkFooter
        class="sticky bottom-2 bg-background"
        @submit="handleSubmit"
        @type-change="handleTypeChange"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
