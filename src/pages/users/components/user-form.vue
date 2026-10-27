<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { User } from '../data/schema'
import type { UserValidator } from '../validators/user.validator'

import { userRoles, userStatus } from '../data/schema'
import { userValidator } from '../validators/user.validator'

const props = defineProps<{
  user?: User
}>()

const emits = defineEmits<{
  close: []
}>()

const { t } = useI18n()

function getInitialValues(user?: User): UserValidator {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    status: user?.status || 'active',
    role: user?.role || 'cashier',
  }
}

const form = useForm({
  defaultValues: getInitialValues(props.user),
  validators: {
    onSubmit: userValidator,
    onBlur: userValidator,
  },
  onSubmit: ({ value }) => {
    const submitUser = props.user ? { ...value, id: props.user.id } : value
    toast(t('users.toast.submitted'), {
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, JSON.stringify(submitUser, null, 2)),
      ),
    })

    emits('close')
  },
})

watch(() => props.user, (user) => {
  form.reset(getInitialValues(user), { keepDefaultValues: true })
})
</script>

<template>
  <div class="max-h-[500px] overflow-y-auto">
    <form class="space-y-8" @submit.prevent="form.handleSubmit">
      <form.Field name="firstName">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
              {{ $t('users.form.firstName') }}
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
              {{ $t('users.form.lastName') }}
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
              {{ $t('users.form.username') }}
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
              {{ $t('users.form.email') }}
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
              {{ $t('users.form.phoneNumber') }}
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
              {{ $t('users.form.status') }}
            </Label>
            <Select
              :model-value="field.state.value"
              @update:model-value="(v:any) => {
                field.handleChange(v)
                field.handleBlur()
              }"
            >
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="$t('users.form.selectStatus')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="st in userStatus" :key="st" :value="st">
                    {{ $t(`users.status.${st}`) }}
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
              {{ $t('users.form.role') }}
            </Label>
            <Select
              :model-value="field.state.value"
              @update:model-value="(v: any) => {
                field.handleChange(v)
                field.handleBlur()
              }"
            >
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="$t('users.form.selectRole')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="role in userRoles" :key="role" :value="role">
                    {{ $t(`users.role.${role}`) }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <Button type="submit" class="w-full">
        {{ $t('users.form.saveChanges') }}
      </Button>
    </form>
  </div>
</template>
