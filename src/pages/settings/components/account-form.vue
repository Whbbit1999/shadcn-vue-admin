<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { CalendarDays, Check, ChevronsUpDown } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

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

const accountFormSchema = toTypedSchema(accountValidator)

// https://github.com/logaretm/vee-validate/issues/3521
// https://github.com/logaretm/vee-validate/discussions/3571
async function onSubmit(values: any) {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
}
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
  <Form v-slot="{ setFieldValue }" :validation-schema="accountFormSchema" class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your name" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is the name that will be displayed on your profile and in emails.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field, value }" name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>Date of birth</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline" :class="cn(
                  'w-[240px] justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )"
              >
                <CalendarDays class="size-4 opacity-50" />
                <span>{{ value ? df.format(toDate(dateValue, getLocalTimeZone())) : "Pick a date" }}</span>
              </Button>
            </FormControl>
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
                  setFieldValue('dob', toDate(v).toISOString())
                }
                else {
                  dateValue = undefined
                  setFieldValue('dob', undefined)
                }
              }"
            />
          </PopoverContent>
        </Popover>
        <FormDescription>
          Your date of birth is used to calculate your age.
        </FormDescription>
        <FormMessage />
      </FormItem>
      <input type="hidden" v-bind="field">
    </FormField>

    <FormField v-slot="{ value }" name="language">
      <FormItem class="flex flex-col">
        <FormLabel>Language</FormLabel>

        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline" role="combobox" :aria-expanded="open" :class="cn(
                  'w-[200px] justify-between',
                  !value && 'text-muted-foreground',
                )"
              >
                {{ value ? languages.find(
                  (language) => language.value === value,
                )?.label : 'Select language...' }}

                <ChevronsUpDown class="size-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </FormControl>
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
                      setFieldValue('language', language.value)
                      open = false
                    }"
                  >
                    <Check
                      :class="cn(
                        'mr-2 h-4 w-4',
                        value === language.value ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                    {{ language.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <FormDescription>
          This is the language that will be used in the dashboard.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update account
      </Button>
    </div>
  </Form>
</template>
