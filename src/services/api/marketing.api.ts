import type { MaybeRefOrGetter } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import { useAxios } from '@/composables/use-axios'

import type {
  WeComChatMessageListResponse,
  WeComChatThreadListParams,
  WeComChatThreadListResponse,
  WeComCustomerDetail,
  WeComCustomerListParams,
  WeComCustomerListResponse,
} from '../types/marketing.type'

export function compactMarketingParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>
}

export function useMarketingApi() {
  const { axiosInstance } = useAxios()

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

  const useGetPrivateChatMessages = (threadId: MaybeRefOrGetter<string | undefined>) => {
    const enabled = computed(() => !!toValue(threadId))

    return useQuery({
      queryKey: ['marketing', 'wecomPrivateChatMessages', threadId],
      queryFn: async () => {
        const id = toValue(threadId)
        const response = await axiosInstance.get<WeComChatMessageListResponse>(`/marketing/wecom/chat-threads/private/${encodeURIComponent(id!)}/messages`)
        return response.data
      },
      enabled,
      staleTime: 1000 * 60 * 2,
    })
  }

  const useGetGroupChatMessages = (roomid: MaybeRefOrGetter<string | undefined>) => {
    const enabled = computed(() => !!toValue(roomid))

    return useQuery({
      queryKey: ['marketing', 'wecomGroupChatMessages', roomid],
      queryFn: async () => {
        const id = toValue(roomid)
        const response = await axiosInstance.get<WeComChatMessageListResponse>(`/marketing/wecom/chat-threads/group/${encodeURIComponent(id!)}/messages`)
        return response.data
      },
      enabled,
      staleTime: 1000 * 60 * 2,
    })
  }

  return {
    useGetWeComCustomers,
    useGetWeComCustomerDetail,
    useGetPrivateChatThreads,
    useGetGroupChatThreads,
    useGetPrivateChatMessages,
    useGetGroupChatMessages,
  }
}
