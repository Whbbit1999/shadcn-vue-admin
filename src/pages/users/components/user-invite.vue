<script setup lang="ts">
import { MailPlus } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { useModal } from '@/composables/use-modal'

import UserInviteForm from './user-invite-form.vue'

const isOpen = ref(false)
const { isDesktop, Modal, contentClass } = useModal()
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component :is="Modal.Trigger" as-child>
      <Button variant="outline">
        <MailPlus />
        Invite User
      </Button>
    </component>

    <component
      :is="Modal.Content" :class="contentClass"
    >
      <component :is="Modal.Header">
        <component :is="Modal.Title">
          <div class="flex items-center gap-2">
            <MailPlus />
            <span>Invite User</span>
          </div>
        </component>
        <component :is="Modal.Description">
          Invite new user to join your team by sending them an email invitation. Assign a role to define their access level.
        </component>
      </component>

      <UserInviteForm />

      <component :is="Modal.Footer" v-if="!isDesktop" class="pt-2">
        <component :is="Modal.Close" as-child>
          <Button variant="outline">
            Cancel
          </Button>
        </component>
      </component>
    </component>
  </component>
</template>
