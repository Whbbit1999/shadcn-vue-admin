<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
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
    toast('You submitted the following values:', {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
  },
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Notifications
    </h3>
    <p class="text-sm text-muted-foreground">
      Configure how you receive notifications.
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-8" @submit.prevent="form.handleSubmit">
    <form.Field name="type">
      <template #default="{ field, state }">
        <FormItem class="space-y-3">
          <Label>Notify me about...</Label>
          <RadioGroup
            class="flex flex-col space-y-1"
            :model-value="field.state.value"
            @update:model-value="(v: any) => field.handleChange(v)"
          >
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="all" />
              <Label class="font-normal">
                All new messages
              </Label>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="mentions" />
              <Label class="font-normal">
                Direct messages and mentions
              </Label>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <RadioGroupItem value="none" />
              <Label class="font-normal">
                Nothing
              </Label>
            </FormItem>
          </RadioGroup>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div>
      <h3 class="mb-4 text-lg font-medium">
        Email Notifications
      </h3>
      <div class="space-y-4">
        <form.Field name="communication_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  Communication emails
                </Label>
                <p class="text-muted-foreground text-sm">
                  Receive emails about your account activity.
                </p>
              </div>
              <Switch
                :checked="field.state.value"
                @update:checked="(v: any) => field.handleChange(v)"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="marketing_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  Marketing emails
                </Label>
                <FieldDescription>
                  Receive emails about new products, features, and more.
                </FieldDescription>
              </div>
              <Switch
                :checked="field.state.value"
                @update:checked="(v: any) => field.handleChange(v)"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="social_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  Social emails
                </Label>
                <FieldDescription>
                  Receive emails for friend requests, follows, and more.
                </FieldDescription>
              </div>
              <Switch
                :checked="field.state.value"
                @update:checked="(v: any) => field.handleChange(v)"
              />
            </FormItem>
          </template>
        </form.Field>

        <form.Field name="security_emails">
          <template #default="{ field }">
            <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
              <div class="space-y-0.5">
                <Label class="text-base">
                  Security emails
                </Label>
                <FieldDescription>
                  Receive emails about your account activity and security.
                </FieldDescription>
              </div>
              <Switch
                :checked="field.state.value"
                @update:checked="(v: any) => field.handleChange(v)"
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
              Use different settings for my mobile devices
            </Label>
            <FieldDescription>
              You can manage your mobile notifications in the
              <a href="/examples/forms">
                mobile settings
              </a> page.
            </FieldDescription>
          </div>
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start">
      <Button type="submit">
        Update notifications
      </Button>
    </div>
  </form>
</template>
