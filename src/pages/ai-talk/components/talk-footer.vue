<script setup lang="ts">
import { ArrowUpIcon, PaperclipIcon } from '@lucide/vue'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'

import type { TalkMode } from '../types'

import TalkType from './talk-type.vue'

const emit = defineEmits<{
  submit: [content: string]
  typeChange: [type: TalkMode]
}>()

const text = shallowRef('')
const talkType = shallowRef<TalkMode>('deep-think')

function handleTypeChange(type: TalkMode) {
  emit('typeChange', type)
}

function handleSubmit() {
  emit('submit', text.value)
  nextTick(() => text.value = '')
}
</script>

<template>
  <InputGroup>
    <InputGroupTextarea v-model="text" placeholder="Ask, Search or Chat..." />
    <InputGroupAddon align="block-end">
      <TalkType v-model:type="talkType" @update:type="handleTypeChange" />

      <InputGroupButton
        variant="ghost"
        class="rounded-full"
        size="icon-xs"
      >
        <PaperclipIcon class="size-4" />
        <span class="sr-only">Add File</span>
      </InputGroupButton>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <InputGroupButton variant="ghost">
            Auto
          </InputGroupButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          class="[--radius:0.95rem]"
        >
          <DropdownMenuItem>Auto</DropdownMenuItem>
          <DropdownMenuItem>Agent</DropdownMenuItem>
          <DropdownMenuItem>Manual</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InputGroupText class="ml-auto">
        52% used
      </InputGroupText>
      <Separator orientation="vertical" class="h-4!" />

      <InputGroupButton
        variant="default"
        class="rounded-full"
        size="icon-xs"
        :disabled="!text"
        @click="handleSubmit"
      >
        <ArrowUpIcon class="size-4" />
        <span class="sr-only">Add File</span>
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>
