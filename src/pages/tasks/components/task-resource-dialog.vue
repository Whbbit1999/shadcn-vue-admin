<script lang="ts" setup>
import { useModal } from '@/composables/use-modal'

import type { Task } from '../data/schema'

import TaskForm from './task-form.vue'

const props = defineProps<{
  task: Task | null
}>()
defineEmits(['close'])

const task = computed(() => props.task)
const title = computed(() => task.value?.id ? `Edit Task` : 'New Task')
const description = computed(() => task.value?.id ? `Edit task ${task.value.id}` : 'Create new task')
const { Modal } = useModal()
</script>

<template>
  <div>
    <component :is="Modal.Header">
      <component :is="Modal.Title">
        {{ title }}
      </component>
      <component :is="Modal.Description">
        {{ description }}
      </component>
    </component>
    <TaskForm class="mt-2" :task="task" @close="$emit('close')" />
  </div>
</template>
