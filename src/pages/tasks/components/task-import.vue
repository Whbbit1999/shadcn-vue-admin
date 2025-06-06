<script lang="ts" setup>
import { Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

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
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton variant="outline">
        Import
        <Download />
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>Import Tasks</UiDialogTitle>
        <UiDialogDescription>
          Import tasks quickly from a CSV file.
        </UiDialogDescription>
      </UiDialogHeader>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <UiLabel>File</UiLabel>
        <UiInput id="file" v-model="file" type="file" />
        <span v-if="error" class="text-destructive">{{ error }}</span>
      </div>
      <UiDialogFooter>
        <UiButton variant="secondary" @click="isOpen = false">
          Cancel
        </UiButton>
        <UiButton @click="onSubmit">
          Import
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>

</style>
