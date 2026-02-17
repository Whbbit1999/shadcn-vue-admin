<script lang="ts" setup>
import { Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/components/prop-ui/modal'

const isOpen = ref(false)
const file = ref()
const error = ref()

watch(file, () => {
  error.value = null
})
watch(isOpen, () => {
  file.value = null
})

function onSubmit() {
  error.value = null

  if (!file.value) {
    error.value = 'File is required'
    return
  }

  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(file.value, null, 2))),
  })
  isOpen.value = false
}
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <UiButton variant="outline">
        Import
        <Download />
      </UiButton>
    </ModalTrigger>

    <ModalContent>
      <ModalHeader>
        <ModalTitle>
          Import Tasks
        </ModalTitle>
        <ModalDescription>
          Import tasks quickly from a CSV file.
        </ModalDescription>
      </ModalHeader>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <UiLabel>File</UiLabel>
        <UiInput id="file" v-model="file" type="file" />
        <span v-if="error" class="text-destructive">{{ error }}</span>
      </div>

      <ModalFooter>
        <UiButton variant="secondary" @click="isOpen = false">
          Cancel
        </UiButton>
        <UiButton @click="onSubmit">
          Import
        </UiButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>
