<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  isLoading?: boolean
  disabled?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  destructive?: boolean
}

const {
  isLoading = false,
  disabled = false,
  destructive = false,
  cancelButtonText,
  confirmButtonText,
} = defineProps<ConfirmDialogProps>()

const emits = defineEmits<{
  confirm: []
}>()

const { t } = useI18n()

const cancelText = computed(() => cancelButtonText ?? t('common.cancel'))
const confirmText = computed(() => confirmButtonText ?? t('common.continue'))

const openModel = defineModel<boolean>('open', {
  default: false,
})

function handleConfirm() {
  emits('confirm')
  openModel.value = false
}
</script>

<template>
  <AlertDialog :open="openModel">
    <AlertDialogContent>
      <AlertDialogHeader class="text-start">
        <AlertDialogTitle>
          <slot name="title" />
        </AlertDialogTitle>
        <AlertDialogDescription as-child>
          <slot name="description" />
        </AlertDialogDescription>
      </AlertDialogHeader>

      <slot />

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading" @click="openModel = false">
          {{ cancelText }}
        </AlertDialogCancel>

        <Button
          :variant="destructive ? 'destructive' : 'default'"
          :disabled="disabled || isLoading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
