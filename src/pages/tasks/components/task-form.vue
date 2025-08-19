<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { FormField } from '@/components/ui/form'

import type { Task } from '../data/schema'

import { labels, priorities, statuses } from '../data/data'

const props = defineProps<{
  task: Task | null
}>()
const emits = defineEmits(['close'])

const formSchema = toTypedSchema(z.object({
  title: z.string().min(2).max(50).default(props.task?.title ?? ''),
  status: z.string().default(props.task?.status ?? ''),
  label: z.string().default(props.task?.label ?? ''),
  priority: z.string().default(props.task?.priority ?? ''),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})
const onSubmit = handleSubmit((values) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
  emits('close')
})
</script>

<template>
  <div>
    <form class="w-2/3 space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="title" :validate-on-blur="!isFieldDirty">
        <UiFormItem>
          <UiFormLabel>Title</UiFormLabel>
          <UiFormControl>
            <UiInput type="text" placeholder="shadcn" v-bind="componentField" />
          </UiFormControl>
          <UiFormDescription />
          <UiFormMessage />
        </UiFormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="status" :validate-on-blur="!isFieldDirty">
        <UiFormItem>
          <UiFormLabel>status</UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
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
          </UiFormControl>
          <UiFormDescription />
          <UiFormMessage />
        </UiFormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="label" :validate-on-blur="!isFieldDirty">
        <UiFormItem>
          <UiFormLabel>label</UiFormLabel>
          <UiFormControl>
            <UiRadioGroup
              class="flex flex-col space-y-1"
              v-bind="componentField"
            >
              <UiFormItem
                v-for="label in labels" :key="label.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <UiFormControl>
                  <UiRadioGroupItem :value="label.value" />
                </UiFormControl>
                <UiFormLabel class="font-normal">
                  {{ label.label }}
                </UiFormLabel>
              </UiFormItem>
            </UiRadioGroup>
          </UiFormControl>
          <UiFormDescription />
          <UiFormMessage />
        </UiFormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="priority" :validate-on-blur="!isFieldDirty">
        <UiFormItem>
          <UiFormLabel>priority</UiFormLabel>
          <UiFormControl>
            <UiRadioGroup
              class="flex flex-col space-y-1"
              v-bind="componentField"
            >
              <UiFormItem
                v-for="priority in priorities" :key="priority.value"
                class="flex items-center space-y-0 gap-x-3"
              >
                <UiFormControl>
                  <UiRadioGroupItem :value="priority.value" />
                </UiFormControl>
                <UiFormLabel class="font-normal">
                  {{ priority.label }}
                </UiFormLabel>
              </UiFormItem>
            </UiRadioGroup>
          </UiFormControl>
          <UiFormDescription />
          <UiFormMessage />
        </UiFormItem>
      </FormField>

      <UiButton type="submit">
        Submit
      </UiButton>
    </form>
  </div>
</template>

<style scoped>

</style>
