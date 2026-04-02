import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { useApiFetch } from '@/composables/use-fetch'

import type { IResponse } from '../types/response.type'

export interface ITask {
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
}

export function useGetTasksQuery() {
  const { apiFetch } = useApiFetch()

  return useQuery<IResponse<ITask[]>, Error>({
    queryKey: ['useGetTasksQuery'],
    queryFn: async () => await apiFetch<IResponse<ITask[]>>('/tasks', {
      method: 'get',
    }),
  })
}

export function useGetTaskByIdQuery(id: number) {
  const { apiFetch } = useApiFetch()

  return useQuery<IResponse<ITask>, Error>({
    queryKey: ['useGetTaskQuery', id],
    queryFn: async () => await apiFetch<IResponse<ITask>>(`/tasks/${id}`, {
      method: 'get',
    }),
  })
}

export function useUpdateTaskMutation(id: number) {
  const { apiFetch } = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, Error, Partial<ITask>>({
    mutationKey: ['useUpdateTaskMutation', id],
    mutationFn: async (data: Partial<ITask>) => await apiFetch<IResponse<boolean>>(`/tasks/${id}`, {
      method: 'put',
      body: data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTaskQuery', id] })
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useCreateTaskMutation() {
  const { apiFetch } = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation<IResponse<ITask>, Error, ITask>({
    mutationKey: ['useCreateTaskMutation'],
    mutationFn: async (data: ITask) => await apiFetch<IResponse<ITask>>('/tasks', {
      method: 'post',
      body: data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useDeleteTaskMutation() {
  const { apiFetch } = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, Error, number>({
    mutationKey: ['useDeleteTaskMutation'],
    mutationFn: async (id: number) => await apiFetch<IResponse<boolean>>(`/tasks/${id}`, {
      method: 'delete',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}
