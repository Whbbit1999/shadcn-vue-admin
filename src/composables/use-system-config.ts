import type { StandardSchemaV1 } from '@tanstack/vue-form'
import type { z } from 'zod'

import { useForm } from '@tanstack/vue-form'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { resolveSystemConfigValue, useSystemConfigQuery } from './use-system-config-query'

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
  const didCreateDefault = shallowRef(false)

  const { data: systemConfigData, isGetting, isPending, create: createConfig, update: updateConfig } = useSystemConfigQuery(key)

  const form = useForm({
    defaultValues: initialConfig,
    validators: {
      onSubmit: schema as StandardSchemaV1<z.input<S>>,
      onBlur: schema as StandardSchemaV1<z.input<S>>,
    },

    onSubmit: ({ value }) => {
      const config = { key, value, description }
      localCacheConfig.value = value

      updateConfig(
        { ...config, value: JSON.stringify(value) },
        {
          onSuccess: () => {
            toast('You submitted the following values:', {
              description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(config, null, 2))),
            })
          },
        },
      )
    },
  })

  watch([systemConfigData, isGetting], ([configData, loading]) => {
    if (loading)
      return

    const configValue = configData
      ? resolveSystemConfigValue(configData.data.value, schema, initialConfig)
      : null

    if (!configValue) {
      localCacheConfig.value = initialConfig
      form.reset(initialConfig, { keepDefaultValues: true })

      if (didCreateDefault.value)
        return

      didCreateDefault.value = true
      createConfig(
        { key, description, value: JSON.stringify(initialConfig) },
        {
          onSuccess: () => {
            localCacheConfig.value = initialConfig
            toast('System config created with default value.', {
              description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify({ key, description, value: initialConfig }, null, 2))),
            })
          },
        },
      )
      return
    }

    didCreateDefault.value = false
    localCacheConfig.value = configValue
    form.reset(configValue, { keepDefaultValues: true })
  }, { immediate: true })

  return {
    isPending,
    isGetting,
    form,
  }
}
