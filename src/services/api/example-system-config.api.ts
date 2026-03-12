import type { AxiosError } from 'axios'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

// import { useAxios } from '@/composables/use-axios'
import type { IResponse } from '../types/response.type'

interface ISystemConfig {
  key: string
  value: string // JSON string
  description?: string
}

const mockData: ISystemConfig[] = [
  {
    key: 'appearance_config',
    value: JSON.stringify({ theme: 'dark', font: 'inter' }),
    description: 'Appearance configuration for the application, including theme color, border radius, and content layout.',
  },
]

function generateReturnData(data: ISystemConfig, success: boolean = true): IResponse<ISystemConfig> {
  return {
    data,
    extra: {},
    code: 200,
    message: 'success',
    success,
  }
}

export function useGetSystemConfigByKeyQuery(key: string) {
  // const { axiosInstance } = useAxios()
  return useQuery<IResponse<ISystemConfig>, AxiosError>({
    queryKey: ['useGetSystemConfigByKeyQuery', key],
    queryFn: async () => {
      const response = await new Promise<ISystemConfig | undefined>((resolve, reject) => {
        setTimeout(() => {
          const config = mockData.find(item => item.key === key)
          if (!config)
            reject(new Error('Config not found'))
          resolve(config)
        }, 1000)
      })
      if (!response) {
        throw new Error('Config not found')
      }
      return generateReturnData(response)
    },
  })
}

export function useUpdateSystemConfigByKeyMutation(key: string) {
  // const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  return useMutation<IResponse<ISystemConfig>, AxiosError, ISystemConfig>({
    mutationKey: ['useUpdateSystemConfigByKeyMutation', key],
    mutationFn: async (data: ISystemConfig) => {
      return await new Promise<IResponse<ISystemConfig>>((resolve) => {
        setTimeout(() => {
          resolve(generateReturnData(data))
        }, 100)
      },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSystemConfigByKeyQuery', key] })
    },
  })
}

export function useCreateSystemMutation() {
  // const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  return useMutation<IResponse<ISystemConfig>, AxiosError, ISystemConfig>({
    mutationKey: ['useCreateTaskMutation'],
    mutationFn: async (data: ISystemConfig) => {
      return new Promise<IResponse<ISystemConfig>>((resolve) => {
        setTimeout(() => {
          resolve(generateReturnData(data))
        }, 100)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSystemConfigByKeyQuery'] })
    },
  })
}
