<script lang="ts" setup>
import { toast } from 'vue-sonner'

import type { Task } from '../data/schema'

const props = defineProps<{
  task: Task
}>()

function handleRemove() {
  toast(`The following task has been deleted:`, {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(props.task, null, 2))),
  })
}
</script>

<template>
  <div>
    <UiDialogTitle>
      <UiDialogTitle>
        Delete this task: {{ task.id }} ?
      </UiDialogTitle>
      <UiDialogDescription class="mt-2 font-medium">
        You are about to delete a task with the ID {{ task.id }}.This action cannot be undone.
      </UiDialogDescription>
    </UiDialogTitle>
    <UiDialogFooter>
      <UiDialogClose as-child>
        <UiButton variant="outline">
          Cancel
        </UiButton>
      </UiDialogClose>

      <UiDialogClose as-child>
        <UiButton variant="destructive" @click="handleRemove">
          Delete
        </UiButton>
      </UiDialogClose>
    </UiDialogFooter>
  </div>
</template>

<style scoped>

</style>
