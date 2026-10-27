<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { ModalDescription, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'

import type { Task } from '../data/schema'

import TaskForm from './task-form.vue'

const props = defineProps<{
  task: Task | null
}>()
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const task = computed(() => props.task)
const title = computed(() => task.value?.id ? t('tasks.edit.title') : t('tasks.create.title'))
const description = computed(() => task.value?.id ? t('tasks.edit.description', { id: task.value.id }) : t('tasks.create.description'))
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
    <TaskForm class="mt-2" :task="task" @close="emit('close')" />
  </div>
</template>
