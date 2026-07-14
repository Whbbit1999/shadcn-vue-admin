<script setup lang="ts">
import { PlusIcon } from '@lucide/vue'

import { Modal, ModalContent, ModalTrigger } from '@/components/prop-ui/modal'

import TaskResourceDialog from './task-resource-dialog.vue'

const isOpen = shallowRef(false)
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <UiButton>
        Create
        <PlusIcon />
      </UiButton>
    </ModalTrigger>

    <ModalContent>
      <TaskResourceDialog :task="null" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
