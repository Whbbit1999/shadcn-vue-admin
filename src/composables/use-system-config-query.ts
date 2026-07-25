import type { z } from 'zod'

import { useCreateSystemMutation, useGetSystemConfigByKeyQuery, useUpdateSystemConfigByKeyMutation } from '@/services/api/example-system-config.api'

/**
 * Parse and validate a raw JSON string config value against a Zod schema.
 */
export function resolveSystemConfigValue<S extends z.ZodObject<z.ZodRawShape>>(
  rawValue: string | undefined,
  schema: S,
  fallback: Readonly<z.input<S>>,
): z.input<S> {
  if (!rawValue)
    return { ...fallback } as z.input<S>

  try {
    const parsed: unknown = JSON.parse(rawValue)
    const result = schema.safeParse(parsed)
    return result.success ? (result.data as z.input<S>) : ({ ...fallback } as z.input<S>)
  }
  catch {
    return { ...fallback } as z.input<S>
  }
}

export function useSystemConfigQuery(key: string) {
  const { data: systemConfigData, isPending: isGetting } = useGetSystemConfigByKeyQuery(key)
  const { mutate: create, isPending: isCreating } = useCreateSystemMutation()
  const { mutate: update, isPending: isUpdating } = useUpdateSystemConfigByKeyMutation(key)
  const isPending = computed(() => isCreating.value || isUpdating.value)

  return {
    data: systemConfigData,
    isGetting,
    isPending,
    create,
    update,
  }
}
