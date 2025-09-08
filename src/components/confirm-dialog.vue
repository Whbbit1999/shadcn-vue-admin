<script lang='ts' setup>
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Continue',
} = defineProps<ConfirmDialogProps>()

const emits = defineEmits<{
  (e: 'confirm'): void
}>()

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
          {{ cancelButtonText }}
        </AlertDialogCancel>

        <UiButton
          :variant="destructive ? 'destructive' : 'default'"
          :disabled="disabled || isLoading"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </UiButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
