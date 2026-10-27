<script setup lang="ts">
import { DownloadIcon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'
import { Input as FileInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { t } = useI18n()

const isOpen = shallowRef(false)
const file = shallowRef()
const error = shallowRef()

watch(file, () => {
  error.value = null
})
watch(isOpen, () => {
  file.value = null
})

function onSubmit() {
  error.value = null

  if (!file.value) {
    error.value = t('tasks.importDialog.fileRequired')
    return
  }

  toast(t('tasks.toast.submitted'), {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(file.value, null, 2))),
  })
  isOpen.value = false
}
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <Button variant="outline">
        {{ $t('tasks.actions.import') }}
        <DownloadIcon />
      </Button>
    </ModalTrigger>

    <ModalContent>
      <ModalHeader>
        <ModalTitle>
          {{ $t('tasks.importDialog.title') }}
        </ModalTitle>
        <ModalDescription>
          {{ $t('tasks.importDialog.description') }}
        </ModalDescription>
      </ModalHeader>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label>{{ $t('tasks.importDialog.file') }}</Label>
        <FileInput id="file" v-model="file" type="file" />
        <span v-if="error" class="text-destructive">{{ error }}</span>
      </div>

      <ModalFooter>
        <Button variant="secondary" @click="isOpen = false">
          {{ $t('tasks.actions.cancel') }}
        </Button>
        <Button @click="onSubmit">
          {{ $t('tasks.actions.import') }}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>
