<script lang="ts" setup>
import { Plus } from 'lucide-vue-next'

import { Modal, ModalContent, ModalTrigger } from '@/components/prop-ui/modal'

import TaskResourceDialog from './task-resource-dialog.vue'

const isOpen = ref(false)
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <UiButton>
        Create
        <Plus />
      </UiButton>
    </ModalTrigger>

    <ModalContent>
      <TaskResourceDialog :task="null" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
