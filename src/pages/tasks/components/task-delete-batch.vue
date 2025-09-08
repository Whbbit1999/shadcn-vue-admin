<script lang="ts" setup generic="T = Task">
import type { Table as VueTable } from '@tanstack/vue-table'

import { toast } from 'vue-sonner'

import ConfirmDialog from '@/components/confirm-dialog.vue'

import type { Task } from '../data/schema'

const { table } = defineProps<{
  table: VueTable<T>
}>()

const openModel = defineModel<boolean>('open', {
  default: false,
})

const CONFIRM_WORD = 'DELETE'

const confirmValue = ref('')

const selectedRows = ref(table.getSelectedRowModel().rows)
const selectedCount = computed(() => selectedRows.value.length || 0)
function handleConfirm() {
  if (confirmValue.value !== CONFIRM_WORD) {
    toast.error(`Please type "${CONFIRM_WORD}" to confirm deletion.`)
    return
  }

  openModel.value = false

  toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
    loading: 'Deleting tasks...',
    success: () => {
      table.resetRowSelection()
      return `Successfully deleted ${selectedRows.value.length} tasks.`
    },
    error: 'Failed to delete tasks.',
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="openModel"
    confirm-button-text="Delete"
    destructive
    :disabled="confirmValue.trim() !== CONFIRM_WORD"
    @confirm="handleConfirm"
  >
    <template #title>
      Delete {{ selectedCount }} tasks?
    </template>
    <template #description>
      Are you sure you want to delete the selected tasks? <br>
      This action cannot be undone.
    </template>

    <template #default>
      <UiLabel class="my-4 flex flex-col items-start gap-1.5">
        <span>Confirm by typing {{ CONFIRM_WORD }}:</span>
        <UiInput
          v-model="confirmValue"
          :placeholder="`Type &quot;${CONFIRM_WORD}&quot; to confirm.`"
        />
      </UiLabel>

      <UiAlert variant="destructive">
        <UiAlertTitle>Warning!</UiAlertTitle>
        <UiAlertDescription>
          Please be careful, this operation can not be rolled back.
        </UiAlertDescription>
      </UiAlert>
    </template>
  </ConfirmDialog>
</template>

<style scoped>

</style>
