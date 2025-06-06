<script lang="ts" setup>
import { Plus } from 'lucide-vue-next'

import TaskResourceDialog from './task-resource-dialog.vue'

const isOpen = ref(false)
</script>

<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton>
        Create
        <Plus />
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent>
      <TaskResourceDialog :task="null" @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>

</style>
