<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { appearanceValidator } from '../validators/appearance.validator'

const appearanceFormSchema = toTypedSchema(appearanceValidator)

const { handleSubmit } = useForm({
  validationSchema: appearanceFormSchema,
  initialValues: {
    theme: 'light',
    font: 'inter',
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
      Appearance
    </h3>
    <p class="text-sm text-muted-foreground">
      Customize the appearance of the app. Automatically switch between day and night themes.
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="font">
      <FormItem>
        <FormLabel>Font</FormLabel>
        <UiSelect v-bind="componentField">
          <UiFormControl>
            <UiSelectTrigger>
              <UiSelectValue placeholder="Select a font" />
            </UiSelectTrigger>
          </UiFormControl>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem value="inter">
                Inter
              </UiSelectItem>
              <UiSelectItem value="manrope">
                Manrope
              </UiSelectItem>
              <UiSelectItem value="system">
                System
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
        <FormDescription>
          Set the font you want to use in the dashboard.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" type="radio" name="theme">
      <FormItem class="space-y-1">
        <FormLabel>Theme</FormLabel>
        <FormDescription>
          Select the theme for the dashboard.
        </FormDescription>
        <FormMessage />

        <RadioGroup
          class="grid max-w-md grid-cols-2 gap-8 pt-2"
          v-bind="componentField"
        >
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary flex flex-col">
              <FormControl>
                <RadioGroupItem value="light" class="sr-only" />
              </FormControl>
              <div class="items-center p-1 border-2 rounded-md border-muted hover:border-accent">
                <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div class="p-2 space-y-2 bg-white rounded-md shadow-xs">
                    <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div class="flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs">
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div class="flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs">
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 font-normal text-center">
                Light
              </span>
            </FormLabel>
          </FormItem>
          <FormItem>
            <FormLabel class="[&:has([data-state=checked])>div]:border-primary flex flex-col">
              <FormControl>
                <RadioGroupItem value="dark" class="sr-only" />
              </FormControl>
              <div class="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
                <div class="p-2 space-y-2 rounded-sm bg-slate-950">
                  <div class="p-2 space-y-2 rounded-md shadow-xs bg-slate-800">
                    <div class="w-20 h-2 rounded-lg bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div class="flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800">
                    <div class="size-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div class="flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800">
                    <div class="size-4 rounded-full bg-slate-400" />
                    <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 font-normal text-center">
                Dark
              </span>
            </FormLabel>
          </FormItem>
        </RadioGroup>
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update preferences
      </Button>
    </div>
  </form>
</template>
