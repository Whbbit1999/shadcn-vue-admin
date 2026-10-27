<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { ModalClose, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'

import type { User } from '../data/schema'

const { user } = defineProps<{
  user: User
}>()

const emits = defineEmits<{
  remove: []
}>()

const { t } = useI18n()

function handleRemove() {
  toast(t('users.delete.toastTitle'), {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(user, null, 2))),
  })

  emits('remove')
}
</script>

<template>
  <div>
    <ModalHeader>
      <ModalTitle>
        {{ $t('users.delete.title', { username: user.username }) }}
      </ModalTitle>

      <ModalDescription>
        {{ $t('users.delete.description', { id: user.id }) }}
      </ModalDescription>
    </ModalHeader>

    <ModalFooter>
      <ModalClose as-child>
        <Button variant="outline">
          {{ $t('users.actions.cancel') }}
        </Button>
      </ModalClose>

      <ModalClose as-child>
        <Button variant="destructive" @click="handleRemove">
          {{ $t('users.actions.delete') }}
        </Button>
      </ModalClose>
    </ModalFooter>
  </div>
</template>
