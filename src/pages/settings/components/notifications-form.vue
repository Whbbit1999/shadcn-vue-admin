<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { I18nT, useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import z from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const { t } = useI18n()

const schema = z.object({
  type: z.enum(['all', 'mentions', 'none']),
  communication_emails: z.boolean(),
  marketing_emails: z.boolean(),
  social_emails: z.boolean(),
  security_emails: z.boolean(),
  mobile: z.boolean(),
})

const defaultValues: z.infer<typeof schema> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
  type: 'all',
  mobile: false,
}

const form = useForm({
  defaultValues,
  validators: {
    onSubmit: schema,
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
      {{ $t('settings.notifications.title') }}
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ $t('settings.notifications.description') }}
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-8" @submit.prevent="form.handleSubmit">
    <form.Field name="type">
      <template #default="{ field, state }">
        <FormItem class="space-y-3">
          <Label>{{ $t('settings.notifications.notifyAbout') }}</Label>
          <RadioGroup
            class="flex flex-col space-y-1"
            :model-value="field.state.value"
            @update:model-value="(v: any) => field.handleChange(v)"
          >
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="all" />
              <Label class="font-normal">
                {{ $t('settings.notifications.typeAll') }}
              </Label>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="mentions" />
              <Label class="font-normal">
                {{ $t('settings.notifications.typeMentions') }}
              </Label>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="none" />
              <Label class="font-normal">
                {{ $t('settings.notifications.typeNothing') }}
              </Label>
            </FormItem>
          </RadioGroup>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div>
      <h3 class="mb-4 text-lg font-medium">
        {{ $t('settings.notifications.emailHeading') }}
      </h3>
      <div class="space-y-4">
        <form.Field name="communication_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  {{ $t('settings.notifications.communication') }}
                </Label>
                <p class="text-muted-foreground text-sm">
                  {{ $t('settings.notifications.communicationDescription') }}
                </p>
              </div>
              <Switch
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="marketing_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  {{ $t('settings.notifications.marketing') }}
                </Label>
                <FieldDescription>
                  {{ $t('settings.notifications.marketingDescription') }}
                </FieldDescription>
              </div>
              <Switch
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="social_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  {{ $t('settings.notifications.social') }}
                </Label>
                <FieldDescription>
                  {{ $t('settings.notifications.socialDescription') }}
                </FieldDescription>
              </div>
              <Switch
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="security_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  {{ $t('settings.notifications.security') }}
                </Label>
                <FieldDescription>
                  {{ $t('settings.notifications.securityDescription') }}
                </FieldDescription>
              </div>
              <Switch
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              />
            </FormItem>
          </template>
        </form.Field>
      </div>
    </div>

    <form.Field name="mobile">
      <template #default="{ field }">
        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
          <Checkbox
            :model-value="field.state.value"
            @update:model-value="(v: any) => field.handleChange(v)"
          />
          <div class="space-y-1 leading-none">
            <Label>
              {{ $t('settings.notifications.useMobile') }}
            </Label>
            <FieldDescription>
              <I18nT keypath="settings.notifications.useMobileDescription" tag="span" scope="global">
                <template #link>
                  <a href="/examples/forms">{{ $t('settings.notifications.mobileSettings') }}</a>
                </template>
              </I18nT>
            </FieldDescription>
          </div>
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start">
      <Button type="submit">
        {{ $t('settings.notifications.submit') }}
      </Button>
    </div>
  </form>
</template>
