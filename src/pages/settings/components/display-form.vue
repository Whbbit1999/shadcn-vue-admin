<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const form = useForm({
  defaultValues: {
    items: ['recents', 'home'] as string[],
  },
  onSubmit: ({ value }) => {
    toast('You submitted the following values:', {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
  },
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Display
    </h3>
    <p class="text-sm text-muted-foreground">
      Turn items on or off to control what's displayed in the app.
    </p>
  </div>
  <Separator class="my-4" />
  <form @submit.prevent="form.handleSubmit">
    <form.Field name="items">
      <template #default="{ field, state }">
        <FormItem>
          <div class="mb-4">
            <Label class="text-base">
              Sidebar
            </Label>
            <FieldDescription>
              Select the items you want to display in the sidebar.
            </FieldDescription>
          </div>

          <div v-for="item in items" :key="item.id">
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox
                :model-value="(field.state.value as string[]).includes(item.id)"
                @update:model-value="(checked: boolean | 'indeterminate') => {
                  const current = [...field.state.value as string[]]
                  field.handleChange(checked ? [...current, item.id] : current.filter(id => id !== item.id))
                }"
              />
              <Label class="font-normal">
                {{ item.label }}
              </Label>
            </FormItem>
          </div>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start mt-4">
      <Button type="submit">
        Update display
      </Button>
    </div>
  </form>
</template>
