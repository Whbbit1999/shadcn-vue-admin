<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const { t } = useI18n()

const items = [
  {
    id: 'recents',
    labelKey: 'settings.display.items.recents',
  },
  {
    id: 'home',
    labelKey: 'settings.display.items.home',
  },
  {
    id: 'applications',
    labelKey: 'settings.display.items.applications',
  },
  {
    id: 'desktop',
    labelKey: 'settings.display.items.desktop',
  },
  {
    id: 'downloads',
    labelKey: 'settings.display.items.downloads',
  },
  {
    id: 'documents',
    labelKey: 'settings.display.items.documents',
  },
] as const

const form = useForm({
  defaultValues: {
    items: ['recents', 'home'] as string[],
  },
  onSubmit: ({ value }) => {
    toast(t('common.submittedTitle'), {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
  },
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      {{ $t('settings.display.title') }}
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ $t('settings.display.description') }}
    </p>
  </div>
  <Separator class="my-4" />
  <form @submit.prevent="form.handleSubmit">
    <form.Field name="items">
      <template #default="{ field, state }">
        <FormItem>
          <div class="mb-4">
            <Label class="text-base">
              {{ $t('settings.display.sidebar') }}
            </Label>
            <FieldDescription>
              {{ $t('settings.display.sidebarDescription') }}
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
                {{ $t(item.labelKey) }}
              </Label>
            </FormItem>
          </div>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start mt-4">
      <Button type="submit">
        {{ $t('settings.display.submit') }}
      </Button>
    </div>
  </form>
</template>
