<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarDaysIcon, CheckIcon, ChevronsUpDownIcon } from '@lucide/vue'
import { useForm } from '@tanstack/vue-form'
import { toDate } from 'reka-ui/date'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const open = shallowRef(false)
const dateValue = shallowRef()
const placeholder = shallowRef()

const languages = [
  { labelKey: 'settings.account.languages.english', value: 'en' },
  { labelKey: 'settings.account.languages.french', value: 'fr' },
  { labelKey: 'settings.account.languages.german', value: 'de' },
  { labelKey: 'settings.account.languages.spanish', value: 'es' },
  { labelKey: 'settings.account.languages.portuguese', value: 'pt' },
  { labelKey: 'settings.account.languages.russian', value: 'ru' },
  { labelKey: 'settings.account.languages.japanese', value: 'ja' },
  { labelKey: 'settings.account.languages.korean', value: 'ko' },
  { labelKey: 'settings.account.languages.chinese', value: 'zh' },
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
    toast(t('common.submittedTitle'), {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
  },
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      {{ $t('settings.account.title') }}
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ $t('settings.account.description') }}
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-8" @submit.prevent="form.handleSubmit">
    <form.Field name="name">
      <template #default="{ field, state }">
        <FormItem>
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.account.name') }}
          </Label>
          <Input
            type="text"
            :placeholder="$t('settings.account.namePlaceholder')"
            :model-value="field.state.value"
            @input="field.handleChange($event.target.value)"
            @blur="field.handleBlur"
          />
          <FieldDescription>
            {{ $t('settings.account.nameDescription') }}
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="dob">
      <template #default="{ field, state }">
        <FormItem class="flex flex-col">
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.account.dob') }}
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
                <span>{{ field.state.value ? df.format(toDate(dateValue, getLocalTimeZone())) : $t('settings.account.dobPlaceholder') }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                v-model:placeholder="placeholder"
                v-model="dateValue"
                :calendar-label="$t('settings.account.dob')"
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
            {{ $t('settings.account.dobDescription') }}
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <form.Field name="language">
      <template #default="{ field, state }">
        <FormItem class="flex flex-col">
          <Label :data-error="!!state.meta.errors?.length" class="data-[error=true]:text-destructive">
            {{ $t('settings.account.language') }}
          </Label>

          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                variant="outline" role="combobox" :aria-expanded="open" :class="cn(
                  'w-[200px] justify-between',
                  !field.state.value && 'text-muted-foreground',
                )"
              >
                {{ field.state.value ? $t(languages.find(
                  (language) => language.value === field.state.value,
                )?.labelKey ?? 'settings.account.language') : $t('settings.account.languagePlaceholder') }}

                <ChevronsUpDownIcon class="size-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandInput :placeholder="$t('settings.account.languageSearch')" />
                <CommandEmpty>{{ $t('settings.account.languageEmpty') }}</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="language in languages" :key="language.value" :value="$t(language.labelKey)"
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
                      {{ $t(language.labelKey) }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FieldDescription>
            {{ $t('settings.account.languageDescription') }}
          </FieldDescription>
          <FieldError :errors="state.meta.errors" />
        </FormItem>
      </template>
    </form.Field>

    <div class="flex justify-start">
      <Button type="submit">
        {{ $t('settings.account.submit') }}
      </Button>
    </div>
  </form>
</template>
