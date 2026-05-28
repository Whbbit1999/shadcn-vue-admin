import type { StandardSchemaV1 } from '@tanstack/vue-form'
import type { z } from 'zod'

import { useForm } from '@tanstack/vue-form'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { useCreateSystemMutation, useGetSystemConfigByKeyQuery, useUpdateSystemConfigByKeyMutation } from '@/services/api/example-system-config.api'

export function useSystemConfig<S extends z.ZodObject<z.ZodRawShape>>({
  key,
  defaultValue,
  description,
  schema,
}: {
  key: string
  defaultValue: Readonly<z.input<S>>
  description: string
  schema: S
}) {
  const initialConfig = { ...defaultValue } as z.input<S>

  const localCacheConfig = useStorage<z.input<S>>(key, initialConfig)

  const { data: systemConfigData, isPending: isGetSystemConfigByKeyQueryPending } = useGetSystemConfigByKeyQuery(key)
  const { mutate: createSystemConfigMutate, isPending: isCreateSystemConfigPending } = useCreateSystemMutation()
  const { mutate: updateSystemConfigMutate, isPending: isUpdateSystemConfigPending } = useUpdateSystemConfigByKeyMutation(key)
  const isPending = computed(() => isCreateSystemConfigPending.value || isUpdateSystemConfigPending.value)

  const form = useForm({
    defaultValues: initialConfig,
    validators: {
      onSubmit: schema as StandardSchemaV1<z.input<S>>,
      onBlur: schema as StandardSchemaV1<z.input<S>>,
    },

    onSubmit: ({ value }) => {
      const config = {
        key,
        value,
        description,
      }

      localCacheConfig.value = value

      updateSystemConfigMutate({
        ...config,
        value: JSON.stringify(value),
      }, {
        onSuccess: () => {
          toast('You submitted the following values:', {
            description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(config, null, 2))),
          })
        },
      })
    },
  })

  watch(systemConfigData, () => {
    if (!isGetSystemConfigByKeyQueryPending.value && !systemConfigData.value) {
      localCacheConfig.value = systemConfigData.value
      createSystemConfigMutate({
        key,
        description,
        value: JSON.stringify(defaultValue),
      }, {
        onSuccess: () => {
          localCacheConfig.value = initialConfig
          toast('System config created with default value.', {
            description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify({ key, description, value: defaultValue }, null, 2))),
          })
        },
      })
      return
    }

    const configValue: z.input<S> = systemConfigData.value?.data?.value
      ? JSON.parse(systemConfigData.value.data.value)
      : initialConfig
    localCacheConfig.value = configValue
    form.reset(configValue, { keepDefaultValues: true })
  }, { immediate: true, deep: true })

  return {
    isPending,
    isGetting: isGetSystemConfigByKeyQueryPending,
    form,
  }
}
