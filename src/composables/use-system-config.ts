import type { StandardSchemaV1 } from '@tanstack/vue-form'
import type { z } from 'zod'

import { useForm } from '@tanstack/vue-form'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { useCreateSystemMutation, useGetSystemConfigByKeyQuery, useUpdateSystemConfigByKeyMutation } from '@/services/api/example-system-config.api'

function cloneConfig<S extends z.ZodObject<z.ZodRawShape>>(value: Readonly<z.input<S>>): z.input<S> {
  return { ...value } as z.input<S>
}

export function resolveSystemConfigValue<S extends z.ZodObject<z.ZodRawShape>>(
  rawValue: string | undefined,
  schema: S,
  fallback: Readonly<z.input<S>>,
): z.input<S> {
  if (!rawValue)
    return cloneConfig<S>(fallback)

  try {
    const parsed: unknown = JSON.parse(rawValue)
    const result = schema.safeParse(parsed)
    return result.success ? result.data as z.input<S> : cloneConfig<S>(fallback)
  }
  catch {
    return cloneConfig<S>(fallback)
  }
}

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
  const initialConfig = cloneConfig<S>(defaultValue)

  const localCacheConfig = useStorage<z.input<S>>(key, initialConfig)
  const didCreateDefaultConfig = shallowRef(false)

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

  watch([systemConfigData, isGetSystemConfigByKeyQueryPending], ([configData, isGetting]) => {
    if (isGetting)
      return

    if (!configData) {
      const configValue = cloneConfig<S>(initialConfig)
      localCacheConfig.value = configValue
      form.reset(configValue, { keepDefaultValues: true })

      if (didCreateDefaultConfig.value)
        return

      didCreateDefaultConfig.value = true
      createSystemConfigMutate({
        key,
        description,
        value: JSON.stringify(configValue),
      }, {
        onSuccess: () => {
          localCacheConfig.value = configValue
          toast('System config created with default value.', {
            description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify({ key, description, value: configValue }, null, 2))),
          })
        },
      })
      return
    }

    didCreateDefaultConfig.value = false

    const configValue = resolveSystemConfigValue(configData.data.value, schema, initialConfig)
    localCacheConfig.value = configValue
    form.reset(configValue, { keepDefaultValues: true })
  }, { immediate: true })

  return {
    isPending,
    isGetting: isGetSystemConfigByKeyQueryPending,
    form,
  }
}
