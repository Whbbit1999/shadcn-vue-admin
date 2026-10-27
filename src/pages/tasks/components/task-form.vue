<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Task } from '../data/schema'
import type { TaskValidator } from '../validators/task.validator'

import { labels, priorities, statuses } from '../data/data'
import { taskValidator } from '../validators/task.validator'

const props = defineProps<{
  task: Task | null
}>()
const emits = defineEmits<{
  close: []
}>()

const { t } = useI18n()

function getInitialValues(task: Task | null): TaskValidator {
  return {
    title: task ? task.title : '',
    status: task ? task.status : 'backlog',
    label: task ? task.label : 'feature',
    priority: task ? task.priority : 'medium',
  }
}

const form = useForm({
  defaultValues: getInitialValues(props.task),
  validators: {
    onSubmit: taskValidator,
    onBlur: taskValidator,
  },
  onSubmit: ({ value }) => {
    toast(t('tasks.toast.submitted'), {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
    emits('close')
  },
})

watch(() => props.task, (task) => {
  form.reset(getInitialValues(task), { keepDefaultValues: true })
})
</script>

<template>
  <div>
    <form class="w-2/3 space-y-6" @submit.prevent="form.handleSubmit">
      <form.Field name="title">
        <template #default="{ field, state }">
          <FormItem>
            <Label>{{ $t('tasks.form.title') }}</Label>
            <Input
              type="text"
              :placeholder="$t('tasks.form.titlePlaceholder')"
              :model-value="field.state.value"
              @input="field.handleChange($event.target.value)"
              @blur="field.handleBlur"
            />
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="status">
        <template #default="{ field, state }">
          <FormItem>
            <Label>{{ $t('tasks.form.status') }}</Label>
            <Select
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <SelectTrigger class="w-[180px]">
                <SelectValue :placeholder="$t('tasks.form.selectStatus')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="status in statuses" :key="status.value" :value="status.value">
                    <div class="flex items-center gap-2">
                      <component :is="status.icon" class="size-4 shrink-0" />
                      {{ $t(status.labelKey) }}
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="label">
        <template #default="{ field, state }">
          <FormItem>
            <Label>{{ $t('tasks.form.label') }}</Label>
            <RadioGroup
              class="flex flex-col space-y-1"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <FormItem
                v-for="label in labels" :key="label.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <RadioGroupItem :value="label.value" />
                <Label class="font-normal">
                  {{ $t(label.labelKey) }}
                </Label>
              </FormItem>
            </RadioGroup>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="priority">
        <template #default="{ field, state }">
          <FormItem>
            <Label>{{ $t('tasks.form.priority') }}</Label>
            <RadioGroup
              class="flex flex-col space-y-1"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <FormItem
                v-for="priority in priorities" :key="priority.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <RadioGroupItem :value="priority.value" />
                <Label class="font-normal">
                  {{ $t(priority.labelKey) }}
                </Label>
              </FormItem>
            </RadioGroup>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <Button type="submit">
        {{ $t('tasks.form.submit') }}
      </Button>
    </form>
  </div>
</template>
