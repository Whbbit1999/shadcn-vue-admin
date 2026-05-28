<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarDaysIcon, CheckIcon, ChevronsUpDownIcon } from '@lucide/vue'
import { useForm } from '@tanstack/vue-form'
import { toDate } from 'reka-ui/date'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { AccountValidator } from '../validators/account.validator'

import { accountValidator } from '../validators/account.validator'

const open = ref(false)
const dateValue = ref()
const placeholder = ref()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const defaultValues: AccountValidator = {
  name: '',
  dob: undefined as string | undefined,
  language: '',
}

const form = useForm({
  defaultValues,
  validators: {
    onSubmit: accountValidator,
    onBlur: accountValidator,
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
      Account
    </h3>
    <p class="text-sm text-muted-foreground">
      Update your account settings. Set your preferred language and timezone.
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-8" @submit.prevent="form.handleSubmit">
    <form.Field name="name">
      <template #default="{ field, state }">
        <FormItem>
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            Name
          </Label>
          <Input
            type="text"
            placeholder="Your name"
            :model-value="field.state.value"
            @input="field.handleChange($event.target.value)"
            @blur="field.handleBlur"
          />
          <FieldDescription>
            This is the name that will be displayed on your profile and in emails.
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="dob">
      <template #default="{ field, state }">
        <FormItem class="flex flex-col">
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            Date of birth
          </Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline" :class="cn(
                  'w-[240px] justify-start text-left font-normal',
                  !field.state.value && 'text-muted-foreground',
                )"
              >
                <CalendarDaysIcon class="size-4 opacity-50" />
                <span>{{ field.state.value ? df.format(toDate(dateValue, getLocalTimeZone())) : 'Pick a date' }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                v-model:placeholder="placeholder"
                v-model="dateValue"
                calendar-label="Date of birth"
                initial-focus
                :min-value="new CalendarDate(1900, 1, 1)"
                :max-value="today(getLocalTimeZone())"
                @update:model-value="(v) => {
                  if (v) {
                    dateValue = v
                    form.setFieldValue('dob', toDate(v).toISOString())
                  }
                  else {
                    dateValue = undefined
                    form.setFieldValue('dob', undefined)
                  }
                  field.handleBlur()
                }"
              />
            </PopoverContent>
          </Popover>
          <FieldDescription>
            Your date of birth is used to calculate your age.
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="language">
      <template #default="{ field, state }">
        <FormItem class="flex flex-col">
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            Language
          </Label>

          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                variant="outline" role="combobox" :aria-expanded="open" :class="cn(
                  'w-[200px] justify-between',
                  !field.state.value && 'text-muted-foreground',
                )"
              >
                {{ field.state.value ? languages.find(
                  (language) => language.value === field.state.value,
                )?.label : 'Select language...' }}

                <ChevronsUpDownIcon class="size-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="language in languages" :key="language.value" :value="language.label"
                      @select="() => {
                        form.setFieldValue('language', language.value)
                        open = false
                        field.handleBlur()
                      }"
                    >
                      <CheckIcon
                        :class="cn(
                          'mr-2 h-4 w-4',
                          field.state.value === language.value ? 'opacity-100' : 'opacity-0',
                        )"
                      />
                      {{ language.label }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FieldDescription>
            This is the language that will be used in the dashboard.
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start">
      <Button type="submit">
        Update account
      </Button>
    </div>
  </form>
</template>
