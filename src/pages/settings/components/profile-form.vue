<script setup lang="ts">
import { XIcon } from '@lucide/vue'
import { useForm } from '@tanstack/vue-form'
import { I18nT, useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import type { ProfileValidator } from '../validators/profile.validator'

import { profileValidator } from '../validators/profile.validator'

const { t } = useI18n()

const verifiedEmails = ['m@example.com', 'm@google.com', 'm@support.com']

const defaultValues: ProfileValidator = {
  username: '',
  email: '',
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

const form = useForm({
  defaultValues,
  validators: {
    onSubmit: profileValidator,
    onBlur: profileValidator,
  },
  onSubmit: ({ value }) => {
    toast(t('common.submittedTitle'), {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
  },
})
function isInvalid(field: any) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      {{ $t('settings.profile.title') }}
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ $t('settings.profile.description') }}
    </p>
  </div>
  <Separator orientation="horizontal" class="my-4" />
  <form class="space-y-8" @submit.prevent="form.handleSubmit">
    <form.Field name="username">
      <template #default="{ field, state }">
        <FormItem>
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.profile.username') }}
          </Label>
          <Input
            type="text"
            placeholder="shadcn"
            :model-value="field.state.value"
            @input="field.handleChange($event.target.value)"
            @blur="field.handleBlur"
          />
          <FieldDescription>
            {{ $t('settings.profile.usernameDescription') }}
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="email">
      <template #default="{ field, state }">
        <FormItem :data-invalid="isInvalid(field)">
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.profile.email') }}
          </Label>

          <Select
            :name="field.name"
            :model-value="field.state.value"
            @update:model-value="($event) => {
              field.handleChange($event as string),
              field.handleBlur()
            }"
          >
            <SelectTrigger :aria-invalid="isInvalid(field)">
              <SelectValue :placeholder="$t('settings.profile.emailPlaceholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="email in verifiedEmails" :key="email" :value="email">
                  {{ email }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            {{ $t('settings.profile.emailDescription') }}
          </FieldDescription>
          <FieldError :data-invalid="isInvalid(field)" :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="bio">
      <template #default="{ field, state }">
        <FormItem>
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.profile.bio') }}
          </Label>
          <Textarea
            :placeholder="$t('settings.profile.bioPlaceholder')"
            :model-value="field.state.value"
            @input="field.handleChange($event.target.value)"
            @blur="field.handleBlur"
          />
          <FieldDescription>
            <I18nT keypath="settings.profile.bioDescription" tag="span" scope="global">
              <template #mention>
                <span>@mention</span>
              </template>
            </I18nT>
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div>
      <form.Field name="urls" mode="array">
        <template #default="{ field }">
          <div v-for="(_, index) in field.state.value" :key="`urls-${index}`" class="mb-2">
            <form.Field :name="`urls[${index}].value`">
              <template #default="{ field: subField, state: subState }">
                <FormItem>
                  <Label
                    :class="cn(index !== 0 && 'sr-only')"
                    :data-error="!!subState.meta.errors?.length"
                    class="data-[error=true]:text-destructive"
                  >
                    {{ $t('settings.profile.urls') }}
                  </Label>
                  <p :class="cn(index !== 0 && 'sr-only')" class="text-muted-foreground text-sm">
                    {{ $t('settings.profile.urlsDescription') }}
                  </p>
                  <div class="relative flex items-center">
                    <Input
                      type="url"
                      :model-value="subField.state.value"
                      @input="subField.handleChange($event.target.value)"
                      @blur="subField.handleBlur"
                    />
                    <button type="button" class="absolute py-2 pe-3 end-0 text-muted-foreground" @click="field.removeValue(index)">
                      <XIcon class="w-3" />
                    </button>
                  </div>
                  <FieldError :errors="subState.meta.errors" />
                </FormItem>
              </template>
            </form.Field>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            class="w-20 mt-2 text-xs"
            @click="field.pushValue({ value: '' })"
          >
            {{ $t('settings.profile.addUrl') }}
          </Button>
        </template>
      </form.Field>
    </div>

    <div class="flex justify-start gap-2">
      <Button type="submit">
        {{ $t('settings.profile.submit') }}
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="form.reset()"
      >
        {{ $t('common.resetForm') }}
      </Button>
    </div>
  </form>
</template>
