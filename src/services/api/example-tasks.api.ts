import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { apiFetch } from '@/lib/api-client'

import type { IResponse } from '../types/response.type'

export interface ITask {
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
}

// Transport layer (pure functions, unit-testable without a Vue app)
export async function fetchTasks() {
  return await apiFetch<IResponse<ITask[]>>('/tasks', {
    method: 'get',
  })
}

export async function fetchTaskById(id: number) {
  return await apiFetch<IResponse<ITask>>(`/tasks/${id}`, {
    method: 'get',
  })
}

export async function updateTask(id: number, data: Partial<ITask>) {
  return await apiFetch<IResponse<boolean>>(`/tasks/${id}`, {
    method: 'put',
    body: data,
  })
}

export async function createTask(data: ITask) {
  return await apiFetch<IResponse<ITask>>('/tasks', {
    method: 'post',
    body: data,
  })
}

export async function deleteTask(id: number) {
  return await apiFetch<IResponse<boolean>>(`/tasks/${id}`, {
    method: 'delete',
  })
}

// Query/mutation hooks
export function useGetTasksQuery() {
  return useQuery<IResponse<ITask[]>, Error>({
    queryKey: ['useGetTasksQuery'],
    queryFn: fetchTasks,
  })
}

export function useGetTaskByIdQuery(id: number) {
  return useQuery<IResponse<ITask>, Error>({
    queryKey: ['useGetTaskQuery', id],
    queryFn: () => fetchTaskById(id),
  })
}

export function useUpdateTaskMutation(id: number) {
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, Error, Partial<ITask>>({
    mutationKey: ['useUpdateTaskMutation', id],
    mutationFn: data => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTaskQuery', id] })
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation<IResponse<ITask>, Error, ITask>({
    mutationKey: ['useCreateTaskMutation'],
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation<IResponse<boolean>, Error, number>({
    mutationKey: ['useDeleteTaskMutation'],
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetTasksQuery'] })
    },
  })
}
