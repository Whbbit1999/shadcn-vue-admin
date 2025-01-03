<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import { z } from 'zod'
import Layout from './components/Layout.vue'

const formSchema = toTypedSchema(z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    security_emails: true,
  },
})

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <Layout>
    <Card class="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle class="text-2xl">
          Notifications
        </CardTitle>
        <CardDescription>
          Configure how you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <form class="w-full space-y-6" @submit="onSubmit">
          <div>
            <h3 class="mb-4 text-lg font-medium">
              Email Notifications
            </h3>

            <div class="space-y-4">
              <FormField v-slot="{ value, handleChange }" name="marketing_emails">
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
                      @update-checked="handleChange"
                    />
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ value, handleChange }" name="security_emails">
                <FormItem class="flex flex-row items-center justify-between p-4 border rounded-lg">
                  <div class="space-y-0.5">
                    <FormLabel class="text-base">
                      Security emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your account security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      :checked="value"
                      disabled
                      aria-readonly
                      @update:checked="handleChange"
                    />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
          </div>
          <Button type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  </Layout>
</template>
