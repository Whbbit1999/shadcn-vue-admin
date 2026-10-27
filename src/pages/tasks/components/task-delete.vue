<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { ModalClose, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'

import type { Task } from '../data/schema'

const props = defineProps<{
  task: Task
}>()

const { t } = useI18n()

function handleRemove() {
  toast(t('tasks.delete.toastTitle'), {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(props.task, null, 2))),
  })
}
</script>

<template>
  <div>
    <ModalHeader>
      <ModalTitle>
        {{ $t('tasks.delete.title', { id: task.id }) }}
      </ModalTitle>
      <ModalDescription>
        {{ $t('tasks.delete.description', { id: task.id }) }}
      </ModalDescription>
    </ModalHeader>

    <ModalFooter>
      <ModalClose as-child>
        <Button variant="outline">
          {{ $t('tasks.actions.cancel') }}
        </Button>
      </ModalClose>

      <ModalClose as-child>
        <Button variant="destructive" @click="handleRemove">
          {{ $t('tasks.actions.delete') }}
        </Button>
      </ModalClose>
    </ModalFooter>
  </div>
</template>
