<script lang="ts" setup>
import { ModalDescription, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'

import type { Task } from '../data/schema'

import TaskForm from './task-form.vue'

const props = defineProps<{
  task: Task | null
}>()
defineEmits(['close'])

const task = computed(() => props.task)
const title = computed(() => task.value?.id ? `Edit Task` : 'New Task')
const description = computed(() => task.value?.id ? `Edit task ${task.value.id}` : 'Create new task')
</script>

<template>
  <div>
    <ModalHeader>
      <ModalTitle>
        {{ title }}
      </ModalTitle>
      <ModalDescription>
        {{ description }}
      </ModalDescription>
    </ModalHeader>
    <TaskForm class="mt-2" :task="task" @close="$emit('close')" />
  </div>
</template>
