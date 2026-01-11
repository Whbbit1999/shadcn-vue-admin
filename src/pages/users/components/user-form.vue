<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { User } from '../data/schema'
import type { UserValidator } from '../validators/user.validator'

import { userValidator } from '../validators/user.validator'

const { user } = defineProps<{
  user?: User
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const roles = ['superadmin', 'admin', 'cashier', 'manager'] as const
const status = ['active', 'inactive', 'invited', 'suspended'] as const

const initialValues = reactive<UserValidator>({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  username: user?.username || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
  status: user?.status || 'active',
  role: user?.role || 'cashier',
})

const userFormSchema = toTypedSchema(userValidator)
const { handleSubmit } = useForm({
  validationSchema: userFormSchema,
  initialValues,
})

const onSubmit = handleSubmit((values) => {
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
})
</script>

<template>
  <div class="max-h-[500px] overflow-y-auto">
    <form class="space-y-8" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>User Name</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email address</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="phoneNumber">
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="status">
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="state in status" :key="state" :value="state">
                    {{ state }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="role">
        <FormItem>
          <FormLabel>Role</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="role in roles" :key="role" :value="role">
                    {{ role }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full">
        SaveChanges
      </Button>
    </form>
  </div>
</template>
