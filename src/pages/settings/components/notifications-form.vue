<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { notificationsValidator } from '../validators/notifications.validator'

const notificationsFormSchema = toTypedSchema(notificationsValidator)

const { handleSubmit } = useForm({
  validationSchema: notificationsFormSchema,
  initialValues: {
    communication_emails: false,
    marketing_emails: false,
    social_emails: true,
    security_emails: true,
  },
})

const onSubmit = handleSubmit((values) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
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
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" type="radio" name="type">
      <FormItem class="space-y-3">
        <FormLabel>Notify me about...</FormLabel>
        <FormControl>
          <RadioGroup
            class="flex flex-col space-y-1"
            v-bind="componentField"
          >
            <FormItem class="flex items-center  space-y-0">
              <FormControl>
                <RadioGroupItem value="all" />
              </FormControl>
              <FormLabel class="font-normal">
                All new messages
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <FormControl>
                <RadioGroupItem value="mentions" />
              </FormControl>
              <FormLabel class="font-normal">
                Direct messages and mentions
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center  space-y-0">
              <FormControl>
                <RadioGroupItem value="none" />
              </FormControl>
              <FormLabel class="font-normal">
                Nothing
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div>
      <h3 class="mb-4 text-lg font-medium">
        Email Notifications
      </h3>
      <div class="space-y-4">
        <FormField v-slot="{ handleChange, value }" type="checkbox" name="communication_emails">
          <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                Communication emails
              </FormLabel>
              <FormDescription>
                Receive emails about your account activity.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ handleChange, value }" type="checkbox" name="marketing_emails">
          <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                Marketing emails
              </FormLabel>
              <FormDescription>
                Receive emails about new products, features, and more.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ handleChange, value }" type="checkbox" name="social_emails">
          <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                Social emails
              </FormLabel>
              <FormDescription>
                Receive emails for friend requests, follows, and more.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ handleChange, value }" type="checkbox" name="security_emails">
          <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                Security emails
              </FormLabel>
              <FormDescription>
                Receive emails about your account activity and security.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>

    <FormField v-slot="{ handleChange, value }" type="checkbox" name="mobile">
      <FormItem class="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox
            :model-value="value"
            @update:model-value="handleChange"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>
            Use different settings for my mobile devices
          </FormLabel>
          <FormDescription>
            You can manage your mobile notifications in the
            <a href="/examples/forms">
              mobile settings
            </a> page.
          </FormDescription>
        </div>
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update notifications
      </Button>
    </div>
  </form>
</template>
