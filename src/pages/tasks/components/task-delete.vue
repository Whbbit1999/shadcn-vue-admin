<script lang="ts" setup>
import { toast } from 'vue-sonner'

import { useModal } from '@/composables/use-modal'

import type { Task } from '../data/schema'

const props = defineProps<{
  task: Task
}>()

function handleRemove() {
  toast(`The following task has been deleted:`, {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(props.task, null, 2))),
  })
}
const { Modal } = useModal()
</script>

<template>
  <div>
    <component :is="Modal.Header">
      <component :is="Modal.Title">
        Delete this task: {{ task.id }} ?
      </component>
      <component :is="Modal.Description">
        You are about to delete a task with the ID {{ task.id }}.This action cannot be undone.
      </component>
    </component>

    <component :is="Modal.Footer">
      <component :is="Modal.Close" as-child>
        <UiButton variant="outline">
          Cancel
        </UiButton>
      </component>

      <component :is="Modal.Close" as-child>
        <UiButton variant="destructive" @click="handleRemove">
          Delete
        </UiButton>
      </component>
    </component>
  </div>
</template>
