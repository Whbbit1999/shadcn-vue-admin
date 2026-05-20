import type { MaybeRefOrGetter } from 'vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import { useAxios } from '@/composables/use-axios'

import type {
  WeComChatMessageListParams,
  WeComChatMessageListResponse,
  WeComChatThreadListParams,
  WeComChatThreadListResponse,
  WeComCustomerAnalyticsParams,
  WeComCustomerAnalyticsResponse,
  WeComCustomerDetail,
  WeComCustomerListParams,
  WeComCustomerListResponse,
  WeComLeadLatestJobResponse,
  WeComLeadListParams,
  WeComLeadListResponse,
  WeComLeadPromptConfig,
  WeComLeadPromptUpdate,
  WeComLeadTriggerRequest,
  WeComLeadTriggerResponse,
} from '../types/marketing.type'

export function compactMarketingParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>
}

export function useMarketingApi() {
  const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  const useGetWeComCustomers = (params: MaybeRefOrGetter<WeComCustomerListParams>) => {
    return useQuery({
      queryKey: ['marketing', 'wecomCustomers', params],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComCustomerListResponse>(
          '/marketing/wecom/customers',
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetWeComCustomerDetail = (externalUserid: MaybeRefOrGetter<string | undefined>) => {
    const enabled = computed(() => !!toValue(externalUserid))

    return useQuery({
      queryKey: ['marketing', 'wecomCustomerDetail', externalUserid],
      queryFn: async () => {
        const id = toValue(externalUserid)
        const response = await axiosInstance.get<WeComCustomerDetail>(`/marketing/wecom/customers/${encodeURIComponent(id!)}`)
        return response.data
      },
      enabled,
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetWeComCustomerAnalytics = (params: MaybeRefOrGetter<WeComCustomerAnalyticsParams>) => {
    return useQuery({
      queryKey: ['marketing', 'wecomCustomerAnalytics', params],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComCustomerAnalyticsResponse>(
          '/marketing/wecom/customers/analytics',
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      staleTime: 1000 * 60 * 5,
    })
  }

  const useGetPrivateChatThreads = (params: MaybeRefOrGetter<WeComChatThreadListParams>) => {
    return useQuery({
      queryKey: ['marketing', 'wecomPrivateChatThreads', params],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComChatThreadListResponse>(
          '/marketing/wecom/chat-threads/private',
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetGroupChatThreads = (params: MaybeRefOrGetter<WeComChatThreadListParams>) => {
    return useQuery({
      queryKey: ['marketing', 'wecomGroupChatThreads', params],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComChatThreadListResponse>(
          '/marketing/wecom/chat-threads/group',
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetPrivateChatMessages = (
    threadId: MaybeRefOrGetter<string | undefined>,
    params: MaybeRefOrGetter<WeComChatMessageListParams> = {},
  ) => {
    const enabled = computed(() => !!toValue(threadId))

    return useQuery({
      queryKey: ['marketing', 'wecomPrivateChatMessages', threadId, params],
      queryFn: async () => {
        const id = toValue(threadId)
        const response = await axiosInstance.get<WeComChatMessageListResponse>(
          `/marketing/wecom/chat-threads/private/${encodeURIComponent(id!)}/messages`,
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      enabled,
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetGroupChatMessages = (
    roomid: MaybeRefOrGetter<string | undefined>,
    params: MaybeRefOrGetter<WeComChatMessageListParams> = {},
  ) => {
    const enabled = computed(() => !!toValue(roomid))

    return useQuery({
      queryKey: ['marketing', 'wecomGroupChatMessages', roomid, params],
      queryFn: async () => {
        const id = toValue(roomid)
        const response = await axiosInstance.get<WeComChatMessageListResponse>(
          `/marketing/wecom/chat-threads/group/${encodeURIComponent(id!)}/messages`,
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      enabled,
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetWeComLeads = (params: MaybeRefOrGetter<WeComLeadListParams>) => {
    return useQuery({
      queryKey: ['marketing', 'wecomLeads', params],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComLeadListResponse>(
          '/marketing/wecom/leads',
          { params: compactMarketingParams(toValue(params)) },
        )
        return response.data
      },
      staleTime: 1000 * 60,
    })
  }

  const useGetWeComLeadPrompts = () => {
    return useQuery({
      queryKey: ['marketing', 'wecomLeadPrompts'],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComLeadPromptConfig>('/marketing/wecom/leads/prompts')
        return response.data
      },
      staleTime: 1000 * 60 * 2,
    })
  }

  const useSaveWeComLeadPrompts = () => {
    return useMutation({
      mutationFn: async (payload: WeComLeadPromptUpdate) => {
        const response = await axiosInstance.put<WeComLeadPromptConfig>('/marketing/wecom/leads/prompts', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['marketing', 'wecomLeadPrompts'] })
        queryClient.invalidateQueries({ queryKey: ['marketing', 'wecomLeads'] })
      },
    })
  }

  const useGetWeComLeadLatestJob = () => {
    return useQuery({
      queryKey: ['marketing', 'wecomLeadLatestJob'],
      queryFn: async () => {
        const response = await axiosInstance.get<WeComLeadLatestJobResponse>('/marketing/wecom/leads/tagging-jobs/latest')
        return response.data
      },
      refetchInterval: 1000 * 30,
      staleTime: 1000 * 15,
    })
  }

  const useTriggerWeComLeadTaggingJob = () => {
    return useMutation({
      mutationFn: async (payload: WeComLeadTriggerRequest = {}) => {
        const response = await axiosInstance.post<WeComLeadTriggerResponse>('/marketing/wecom/leads/tagging-jobs', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['marketing', 'wecomLeadLatestJob'] })
        queryClient.invalidateQueries({ queryKey: ['marketing', 'wecomLeads'] })
      },
    })
  }

  return {
    useGetWeComCustomers,
    useGetWeComCustomerDetail,
    useGetWeComCustomerAnalytics,
    useGetPrivateChatThreads,
    useGetGroupChatThreads,
    useGetPrivateChatMessages,
    useGetGroupChatMessages,
    useGetWeComLeads,
    useGetWeComLeadPrompts,
    useSaveWeComLeadPrompts,
    useGetWeComLeadLatestJob,
    useTriggerWeComLeadTaggingJob,
  }
}
