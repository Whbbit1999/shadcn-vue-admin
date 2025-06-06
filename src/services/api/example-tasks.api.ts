import type { AxiosError } from 'axios'

import { useMutation, useQuery } from '@tanstack/vue-query'

import { useAxios } from '@/composables/use-axios'

interface ITask {}
export function useGetTaskQuery() {
  const { axiosInstance } = useAxios()
  return useQuery<ITask, AxiosError>({
    queryKey: ['useGetTaskQuery'],
    queryFn: async () => {
      return await axiosInstance.get('/tasks')
    },
  })
}
// if you want use useGetTaskQuery
// you can use it like this
// const { data, error, isPending, isError } = useGetTaskQuery()

interface ITaskCreate {
  name: string
  // description: string
}
export function useCreateTaskMutation() {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationKey: ['useCreateTaskMutation'],
    mutationFn: async (data: ITaskCreate) => {
      return await axiosInstance.post('/tasks', data)
    },
    onSuccess: (task) => {
      // eslint-disable-next-line no-console
      console.log('task created', task)
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('error', error)
      // you can use this error to show error message to user
    },
  })
}
// if you want use useCreateTaskMutation
// you can use it like this
// const createTaskMutation = useCreateTaskMutation()
// createTaskMutation.mutate({ name: 'task name' })
