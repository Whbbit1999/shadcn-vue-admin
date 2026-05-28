<script lang="ts" setup>
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const initialValues: UserValidator = {
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  username: user?.username || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
  status: user?.status || 'active',
  role: user?.role || 'cashier',
}

const form = useForm({
  defaultValues: initialValues,
  validators: {
    onSubmit: userValidator,
    onBlur: userValidator,
  },
  onSubmit: ({ value }) => {
    const submitUser: any = { ...value }
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
  },
})
</script>

<template>
  <div class="max-h-[500px] overflow-y-auto">
    <form class="space-y-8" @submit.prevent="form.handleSubmit">
      <form.Field name="firstName">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              First Name
            </Label>
            <Input
              type="text"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="lastName">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              Last Name
            </Label>
            <Input
              type="text"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="username">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              User Name
            </Label>
            <Input
              type="text"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="email">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              Email address
            </Label>
            <Input
              type="text"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="phoneNumber">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              Phone Number
            </Label>
            <Input
              type="text"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="status">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              Status
            </Label>
            <Select
              :model-value="field.state.value"
              @update:model-value="(v:any) => {
                field.handleChange(v)
                field.handleBlur()
              }"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="st in status" :key="st" :value="st">
                    {{ st }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="role">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              Role
            </Label>
            <Select
              :model-value="field.state.value"
              @update:model-value="(v: any) => {
                field.handleChange(v)
                field.handleBlur()
              }"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="role in roles" :key="role" :value="role">
                    {{ role }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <Button type="submit" class="w-full">
        SaveChanges
      </Button>
    </form>
  </div>
</template>
