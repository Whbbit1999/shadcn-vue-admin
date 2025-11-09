import type { AxiosError } from 'axios'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { useAxios } from '@/composables/use-axios'

import type { IResponse } from '../types/response.type'

export interface ITask {
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
}

export function useGetTasksQuery() {
  const { axiosInstance } = useAxios()

  return useQuery<IResponse<ITask[]>, AxiosError>({
    queryKey: ['useGetTasksQuery'],
    queryFn: async () => {
      const response = await axiosInstance.get('/tasks')
      return response.data
    },
  })
}

export function useGetTaskByIdQuery(id: number) {
  const { axiosInstance } = useAxios()

  return useQuery<IResponse<ITask>, AxiosError>({
    queryKey: ['useGetTaskQuery', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tasks/${id}`)
      return response.data
    },
  })
}

export function useUpdateTaskMutation(id: number) {
  const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, AxiosError, Partial<ITask>>({
    mutationKey: ['useUpdateTaskMutation', id],
    mutationFn: async (data: Partial<ITask>) => {
      return await axiosInstance.put(`/tasks/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTaskQuery', id] })
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useCreateTaskMutation() {
  const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  return useMutation<IResponse<ITask>, AxiosError, ITask>({
    mutationKey: ['useCreateTaskMutation'],
    mutationFn: async (data: ITask) => {
      return await axiosInstance.post('/tasks', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useDeleteTaskMutation() {
  const { axiosInstance } = useAxios()
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, AxiosError, number>({
    mutationKey: ['useDeleteTaskMutation'],
    mutationFn: async (id: number) => {
      return await axiosInstance.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}
