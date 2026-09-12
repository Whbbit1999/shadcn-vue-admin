import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ITask } from '../example-tasks.api'

import { createTask, deleteTask, fetchTaskById, fetchTasks, updateTask } from '../example-tasks.api'

const apiFetch = vi.hoisted(() => vi.fn())

vi.mock('@/lib/api-client', () => ({ apiFetch }))

const task: ITask = {
  title: 'Write tests',
  description: 'Cover the transport layer',
  status: 'pending',
}

const response = { data: task, extra: {}, code: 200, message: 'success', success: true }

describe('example-tasks transport', () => {
  beforeEach(() => {
    apiFetch.mockReset()
    apiFetch.mockResolvedValue(response)
  })

  it('fetches the task list', async () => {
    await expect(fetchTasks()).resolves.toBe(response)
    expect(apiFetch).toHaveBeenCalledWith('/tasks', { method: 'get' })
  })

  it('fetches a single task', async () => {
    await fetchTaskById(7)
    expect(apiFetch).toHaveBeenCalledWith('/tasks/7', { method: 'get' })
  })

  it('updates a task with PUT and the partial body', async () => {
    await updateTask(7, { title: 'Renamed' })
    expect(apiFetch).toHaveBeenCalledWith('/tasks/7', { method: 'put', body: { title: 'Renamed' } })
  })

  it('creates a task with POST and the full body', async () => {
    await createTask(task)
    expect(apiFetch).toHaveBeenCalledWith('/tasks', { method: 'post', body: task })
  })

  it('deletes a task', async () => {
    await deleteTask(7)
    expect(apiFetch).toHaveBeenCalledWith('/tasks/7', { method: 'delete' })
  })
})
