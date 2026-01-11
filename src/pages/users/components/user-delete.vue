<script lang="ts" setup>
import { toast } from 'vue-sonner'

import { useModal } from '@/composables/use-modal'

import type { User } from '../data/schema'

const { user } = defineProps<{
  user: User
}>()

const emits = defineEmits<{
  (e: 'remove'): void
}>()

function handleRemove() {
  toast(`The following task has been deleted:`, {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(user, null, 2))),
  })

  emits('remove')
}

const { Modal } = useModal()
</script>

<template>
  <div>
    <component :is="Modal.Header">
      <component :is="Modal.Title">
        Delete this user: {{ user.username }} ?
      </component>

      <component :is="Modal.Description">
        You are about to delete a user with the ID {{ user.id }}.This action cannot be undone.
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
