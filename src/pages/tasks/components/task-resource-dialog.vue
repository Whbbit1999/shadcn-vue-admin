<script lang="ts" setup>
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
    <UiDialogHeader>
      <UiDialogTitle>
        {{ title }}
      </UiDialogTitle>
      <UiDialogDescription>
        {{ description }}
      </UiDialogDescription>
    </UiDialogHeader>
    <TaskForm class="mt-2" :task="task" @close="$emit('close')" />
  </div>
</template>

<style scoped>

</style>
