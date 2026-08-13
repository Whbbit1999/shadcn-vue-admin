<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { TeamAddValidator } from './validators/team.validator'

import { teamAddValidator } from './validators/team.validator'

const emits = defineEmits<{
  close: []
}>()

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
    <DialogHeader>
      <DialogTitle>
        Add New Team
      </DialogTitle>
      <DialogDescription>
        Add a new team by your self.
      </DialogDescription>
    </DialogHeader>

    <form class="space-y-4" @submit.prevent="form.handleSubmit">
      <form.Field name="name">
        <template #default="{ field, state }">
          <FormItem>
            <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive text-base">
              Name
            </Label>
            <Input
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
            <Input
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
            <Input
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
        <Button type="submit">
          Add team
        </Button>
      </div>
    </form>
  </div>
</template>
