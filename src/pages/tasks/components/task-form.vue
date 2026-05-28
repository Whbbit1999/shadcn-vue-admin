<script lang="ts" setup>
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'

import { FieldError } from '@/components/ui/field'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

import type { Task } from '../data/schema'
import type { TaskValidator } from '../validators/task.validator'

import { labels, priorities, statuses } from '../data/data'
import { taskValidator } from '../validators/task.validator'

const props = defineProps<{
  task: Task | null
}>()
const emits = defineEmits(['close'])

const initialValues: TaskValidator = {
  title: props.task ? props.task.title : '',
  status: props.task ? props.task.status : 'backlog',
  label: props.task ? props.task.label : 'feature',
  priority: props.task ? props.task.priority : 'medium',
}

const form = useForm({
  defaultValues: initialValues,
  validators: {
    onSubmit: taskValidator,
    onBlur: taskValidator,
  },
  onSubmit: ({ value }) => {
    toast('You submitted the following values:', {
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(value, null, 2))),
    })
    emits('close')
  },
})
</script>

<template>
  <div>
    <form class="w-2/3 space-y-6" @submit.prevent="form.handleSubmit">
      <form.Field name="title">
        <template #default="{ field, state }">
          <FormItem>
            <Label>Title</Label>
            <UiInput
              type="text"
              placeholder="shadcn"
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
            <Label>status</Label>
            <UiSelect
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <UiSelectTrigger class="w-[180px]">
                <UiSelectValue placeholder="Select a status" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem v-for="status in statuses" :key="status.value" :value="status.value">
                    <div class="flex items-center gap-2">
                      <component :is="status.icon" class="size-4 shrink-0" />
                      {{ status.label }}
                    </div>
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <form.Field name="label">
        <template #default="{ field, state }">
          <FormItem>
            <Label>label</Label>
            <UiRadioGroup
              class="flex flex-col space-y-1"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <FormItem
                v-for="label in labels" :key="label.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <UiRadioGroupItem :value="label.value" />
                <Label class="font-normal">
                  {{ label.label }}
                </Label>
              </FormItem>
            </UiRadioGroup>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>
      <form.Field name="priority">
        <template #default="{ field, state }">
          <FormItem>
            <Label>priority</Label>
            <UiRadioGroup
              class="flex flex-col space-y-1"
              :model-value="field.state.value"
              @update:model-value="(v) => field.handleChange(v as string)"
            >
              <FormItem
                v-for="priority in priorities" :key="priority.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <UiRadioGroupItem :value="priority.value" />
                <Label class="font-normal">
                  {{ priority.label }}
                </Label>
              </FormItem>
            </UiRadioGroup>
            <FieldError :errors="state.meta.errors" />
          </FormItem>
        </template>
      </form.Field>

      <UiButton type="submit">
        Submit
      </UiButton>
    </form>
  </div>
</template>
