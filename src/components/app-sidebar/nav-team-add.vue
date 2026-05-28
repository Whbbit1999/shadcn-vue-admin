<script lang="ts" setup>
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'

import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

import type { TeamAddValidator } from './validators/team.validator'

import { teamAddValidator } from './validators/team.validator'

const emits = defineEmits(['close'])

const defaultValues: TeamAddValidator = {
  name: '',
  slug: '',
  logo: '',
}

const form = useForm({
  defaultValues,
  validators: {
    onSubmit: teamAddValidator,
    onBlur: teamAddValidator,
  },
  onSubmit: ({ value }) => {
    toast('You submitted the following values:', {
      position: 'top-center',
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })

    emits('close')
  },
})
</script>

<template>
  <div>
    <UiDialogHeader>
      <UiDialogTitle>
        Add New Team
      </UiDialogTitle>
      <UiDialogDescription>
        Add a new team by your self.
      </UiDialogDescription>
    </UiDialogHeader>

    <form class="space-y-4" @submit.prevent="form.handleSubmit">
      <form.Field name="name">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive text-base">
              Name
            </Label>
            <UiInput
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldDescription>
              Set the name for the team.
            </FieldDescription>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="slug">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive text-base">
              Slug
            </Label>
            <UiInput
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldDescription>
              Set the slug for the team.
            </FieldDescription>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="logo">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive text-base">
              Logo
            </Label>
            <UiInput
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldDescription>
              Set the logo of the team.
            </FieldDescription>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <div class="flex justify-start mt-4">
        <UiButton type="submit">
          Add team
        </UiButton>
      </div>
    </form>
  </div>
</template>
