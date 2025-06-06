<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { teamAddValidator } from './validators/team.validator'

const emits = defineEmits(['close'])

const teamAddFormSchema = toTypedSchema(teamAddValidator)

const { handleSubmit } = useForm({
  validationSchema: teamAddFormSchema,
  initialValues: {},
})

const onSubmit = handleSubmit((values) => {
  toast('You submitted the following values:', {
    position: 'top-center',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })

  emits('close')
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

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel class="text-base">
            Name
          </FormLabel>
          <FormControl>
            <UiInput v-bind="componentField" />
          </FormControl>
          <FormDescription>
            Set the name for the team.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="slug">
        <FormItem>
          <FormLabel class="text-base">
            Slug
          </FormLabel>
          <FormControl>
            <UiInput v-bind="componentField" />
          </FormControl>
          <FormDescription>
            Set the slug for the team.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="logo">
        <FormItem>
          <FormLabel class="text-base">
            Logo
          </FormLabel>
          <FormControl>
            <UiInput v-bind="componentField" />
          </FormControl>
          <FormDescription>
            Set the logo of the team.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex justify-start mt-4">
        <UiButton type="submit">
          Add team
        </UiButton>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
