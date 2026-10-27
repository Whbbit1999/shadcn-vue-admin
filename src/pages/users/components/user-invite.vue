<script setup lang="ts">
import { MailPlusIcon } from '@lucide/vue'

import { Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger, useModal } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'

import UserInviteForm from './user-invite-form.vue'

const { isDesktop } = useModal()
const isOpen = shallowRef(false)
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <Button variant="outline">
        <MailPlusIcon />
        {{ $t('users.actions.invite') }}
      </Button>
    </ModalTrigger>

    <ModalContent>
      <ModalHeader>
        <ModalTitle as-child>
          <div class="flex items-center gap-2">
            <MailPlusIcon />
            <span>{{ $t('users.invite.title') }}</span>
          </div>
        </ModalTitle>
        <ModalDescription>
          {{ $t('users.invite.description') }}
        </ModalDescription>
      </ModalHeader>

      <UserInviteForm />

      <ModalFooter v-if="!isDesktop" class="pt-2">
        <ModalClose as-child>
          <Button variant="outline">
            {{ $t('users.actions.cancel') }}
          </Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>
