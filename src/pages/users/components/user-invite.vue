<script setup lang="ts">
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { MailPlus } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import UserInviteForm from './user-invite-form.vue'

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
const isOpen = ref(false)
</script>

<template>
  <UseTemplate>
    <UserInviteForm />
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger>
      <Button variant="outline">
        <MailPlus />
        Invite User
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <div class="flex items-center gap-2">
            <MailPlus />
            <span>Invite User</span>
          </div>
        </DialogTitle>
        <DialogDescription>
          Invite new user to join your team by sending them an email invitation. Assign a role to define their access level.
        </DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <Button variant="outline">
        Invite User
        <MailPlus />
      </Button>
    </DrawerTrigger>
    <DrawerContent class="px-4">
      <DrawerHeader class="text-left">
        <DrawerTitle>
          <div class="flex items-center gap-2">
            <MailPlus />
            <span>Invite User</span>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          Invite new user to join your team by sending them an email invitation. Assign a role to define their access level.
        </DrawerDescription>
      </DrawerHeader>

      <GridForm />

      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
</style>
