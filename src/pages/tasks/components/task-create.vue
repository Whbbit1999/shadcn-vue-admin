<script lang="ts" setup>
import { Plus } from 'lucide-vue-next'

import { useModal } from '@/composables/use-modal'

import TaskResourceDialog from './task-resource-dialog.vue'

const isOpen = ref(false)
const { Modal, contentClass } = useModal()
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component :is="Modal.Trigger" as-child>
      <UiButton>
        Create
        <Plus />
      </UiButton>
    </component>

    <component :is="Modal.Content" :class="contentClass">
      <TaskResourceDialog :task="null" @close="isOpen = false" />
    </component>
  </component>
</template>
