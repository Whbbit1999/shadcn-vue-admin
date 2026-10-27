<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import type { DataTableInstance } from '@/components/data-table'

import ConfirmDialog from '@/components/confirm-dialog.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { Task } from '../data/schema'

const { table } = defineProps<{
  table: DataTableInstance<Task>
}>()

const { t } = useI18n()

const openModel = defineModel<boolean>('open', {
  default: false,
})

const CONFIRM_WORD = 'DELETE'

const confirmValue = shallowRef('')

const selectedRows = computed(() => table.getSelectedRowModel().rows)
const selectedCount = computed(() => selectedRows.value.length || 0)
function handleConfirm() {
  if (confirmValue.value !== CONFIRM_WORD) {
    toast.error(t('tasks.deleteBatch.confirmInvalid', { word: CONFIRM_WORD }))
    return
  }

  const deletedCount = selectedCount.value
  openModel.value = false

  toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
    loading: t('tasks.deleteBatch.loading'),
    success: () => {
      table.resetRowSelection()
      return t('tasks.deleteBatch.success', { count: deletedCount })
    },
    error: t('tasks.deleteBatch.error'),
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="openModel"
    :confirm-button-text="$t('tasks.actions.delete')"
    :cancel-button-text="$t('tasks.actions.cancel')"
    destructive
    :disabled="confirmValue.trim() !== CONFIRM_WORD"
    @confirm="handleConfirm"
  >
    <template #title>
      {{ $t('tasks.deleteBatch.title', { count: selectedCount }) }}
    </template>
    <template #description>
      {{ $t('tasks.deleteBatch.description') }} <br>
      {{ $t('tasks.deleteBatch.warning') }}
    </template>

    <template #default>
      <Label class="my-4 flex flex-col items-start gap-1.5">
        <span>{{ $t('tasks.deleteBatch.confirmHint', { word: CONFIRM_WORD }) }}</span>
        <Input
          v-model="confirmValue"
          :placeholder="$t('tasks.deleteBatch.confirmPlaceholder', { word: CONFIRM_WORD })"
        />
      </Label>

      <Alert variant="destructive">
        <AlertTitle>{{ $t('tasks.deleteBatch.warningTitle') }}</AlertTitle>
        <AlertDescription>
          {{ $t('tasks.deleteBatch.warningDescription') }}
        </AlertDescription>
      </Alert>
    </template>
  </ConfirmDialog>
</template>
