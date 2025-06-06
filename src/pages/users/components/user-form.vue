<script lang="ts" setup>
import { toast } from 'vue-sonner'
import { z } from 'zod'

import AutoForm from '@/components/ui/auto-form/AutoForm.vue'

import type { User } from '../data/schema'

import { userRoleSchema, userStatusSchema } from '../data/schema'

const { user } = defineProps<{
  user?: User
}>()
const emits = defineEmits<{
  (e: 'close'): void
}>()

const formSchema = z.object({
  firstName: z.string().min(1).default(user?.firstName || ''),
  lastName: z.string().min(1).default(user?.lastName || ''),
  username: z.string().min(1).default(user?.username || ''),
  email: z.string().min(1).email().default(user?.email || ''),
  phoneNumber: z.string().min(1).default(user?.phoneNumber || ''),
  status: userStatusSchema.default(user?.status || 'active'),
  role: userRoleSchema.default(user?.role || 'cashier'),
})

function onSubmit(values: Record<string, any>) {
  const submitUser = { ...values }
  if (user) {
    submitUser.id = user.id
  }
  toast('You submitted the following values:', {
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(submitUser, null, 2)),
    ),
  })

  emits('close')
}
</script>

<template>
  <AutoForm
    v-auto-animate
    class="max-h-[500px] overflow-y-auto"
    :schema="formSchema"
    :field-config="{
      email: {
        label: 'Email address',
        inputProps: {
          type: 'email',
        },
      },
    }"
    @submit="onSubmit"
  >
    <div class="flex items-center justify-end mt-2 space-x-2">
      <UiButton type="submit" class="w-full">
        SaveChanges
      </UiButton>
    </div>
  </AutoForm>
</template>

<style scoped>

</style>
