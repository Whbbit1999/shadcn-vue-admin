<script setup lang="ts">
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { MailPlus, Send } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import AutoForm from '@/components/ui/auto-form/AutoForm.vue'
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
import { cn } from '@/lib/utils'

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
const isOpen = ref(false)

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['superadmin', 'admin', 'cashier', 'manager']),
  description: z.string().optional(),
})

function onSubmit(values: Record<string, any>) {
  toast('You submitted the following values:', {
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(values, null, 2)),
    ),
  })
}
</script>

<template>
  <UseTemplate>
    <AutoForm
      v-auto-animate
      class="w-full space-y-6"
      :schema="schema"
      :field-config="{
        email: {
          label: 'Email address',
          inputProps: {
            type: 'email',
          },
        },
        role: {
          label: 'Role',
          component: 'select',
        },
        description: {
          label: 'Description(Optional)',
          component: 'textarea',
        },
      }"
      @submit="onSubmit"
    >
      <div
        :class="cn(
          'flex items-center ',
        )"
      >
        <Button type="submit" class="w-full">
          Invite
          <Send />
        </Button>
      </div>
    </AutoForm>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger>
      <Button variant="outline">
        Invite User
        <MailPlus />
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
    <DrawerContent>
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
