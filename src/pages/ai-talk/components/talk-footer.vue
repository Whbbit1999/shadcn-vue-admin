<script lang="ts" setup>
import { ArrowUp, Paperclip } from 'lucide-vue-next'

import TalkType from './talk-type.vue'

const emit = defineEmits(['submit', 'typeChange'])
const text = ref('')

function handleTypeChange(type: string) {
  emit('typeChange', type)
}

function handleSubmit() {
  emit('submit', text.value)
  nextTick(() => text.value = '')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <main class="w-full p-2 border rounded-md">
      <UiTextarea v-model="text" placeholder="input something" class="mb-2 border-none resize-none outline-1" />

      <div class="flex items-center">
        <TalkType @update:type="handleTypeChange" />

        <div class="flex-1" />

        <UiButton variant="ghost">
          <Paperclip class="size-4" />
        </UiButton>
        <UiButton variant="outline" size="icon" class="rounded-full" :disabled="!text" @click="handleSubmit">
          <ArrowUp class="size-4" />
        </UiButton>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
