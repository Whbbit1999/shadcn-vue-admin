<script setup lang="ts">
import { toast } from 'vue-sonner'

import { ModalClose, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'

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
    <ModalHeader>
      <ModalTitle>
        Delete this task: {{ task.id }} ?
      </ModalTitle>
      <ModalDescription>
        You are about to delete a task with the ID {{ task.id }}. This action cannot be undone.
      </ModalDescription>
    </ModalHeader>

    <ModalFooter>
      <ModalClose as-child>
        <Button variant="outline">
          Cancel
        </Button>
      </ModalClose>

      <ModalClose as-child>
        <Button variant="destructive" @click="handleRemove">
          Delete
        </Button>
      </ModalClose>
    </ModalFooter>
  </div>
</template>
