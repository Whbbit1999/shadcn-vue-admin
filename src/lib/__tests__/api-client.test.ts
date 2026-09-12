import { useQueryClient } from '@tanstack/vue-query'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import { apiFetch } from '@/lib/api-client'
import pinia from '@/plugins/pinia/setup'
import { setupTanstackVueQuery } from '@/plugins/tanstack-vue-query/setup'
import { useAuthStore } from '@/stores/auth'

const { fetchMock, notify, push } = vi.hoisted(() => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  return { fetchMock, notify: vi.fn(), push: vi.fn() }
})

vi.mock('vue-sonner', () => ({ toast: { error: notify } }))
vi.mock('@/router', () => ({ default: { push } }))
vi.mock('@/constants/app-config', () => ({ API_BASE_URL: 'https://example.test/api', API_TIMEOUT: 5000 }))
vi.mock('@/plugins/pinia/setup', async () => {
  const { createPinia } = await import('pinia')
  return { default: createPinia() }
})

const app = createApp({})
setupTanstackVueQuery(app)
const queryClient = app.runWithContext(() => useQueryClient())
const authStore = useAuthStore(pinia)

function respond(status: number) {
  return new Response(JSON.stringify({ message: 'Service unavailable' }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function fetchQuery() {
  return queryClient.fetchQuery({
    queryKey: ['tasks'],
    queryFn: () => apiFetch('/tasks'),
    retry: 1,
    retryDelay: 0,
  })
}

describe('aPI error handling', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authStore.isLogin = true
  })

  afterEach(() => {
    queryClient.clear()
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    [503, 200],
    [503, 503, 200],
  ])('does not notify when retries recover (%j)', async (...statuses) => {
    fetchMock.mockImplementation(() => respond(statuses.shift()!))

    await expect(fetchQuery()).resolves.toBeDefined()
    expect(notify).not.toHaveBeenCalled()
  })

  it('notifies once after both fetch and query retries are exhausted', async () => {
    fetchMock.mockImplementation(() => {
      expect(notify).not.toHaveBeenCalled()
      return respond(503)
    })

    await expect(fetchQuery()).rejects.toMatchObject({ status: 503 })
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(notify).toHaveBeenCalledExactlyOnceWith('Service unavailable')
  })

  it('notifies once after mutation retries are exhausted', async () => {
    fetchMock.mockImplementation(() => respond(503))
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => apiFetch('/tasks', { method: 'post' }),
      retry: 1,
      retryDelay: 0,
    })

    await expect(mutation.execute(undefined)).rejects.toMatchObject({ status: 503 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(notify).toHaveBeenCalledExactlyOnceWith('Service unavailable')
  })

  it('handles concurrent and later 401 responses only once per login', async () => {
    fetchMock.mockImplementation(() => respond(401))

    const results = await Promise.allSettled([fetchQuery(), apiFetch('/tasks/1')])
    expect(results.every(result => result.status === 'rejected')).toBe(true)
    expect(authStore.isLogin).toBe(false)
    expect(notify).toHaveBeenCalledExactlyOnceWith('Your session has expired, please sign in again.')
    expect(push).toHaveBeenCalledExactlyOnceWith({ path: '/auth/sign-in' })

    await expect(apiFetch('/tasks/2')).rejects.toMatchObject({ status: 401 })
    expect(push).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledTimes(1)

    authStore.isLogin = true
    await expect(apiFetch('/tasks/3')).rejects.toMatchObject({ status: 401 })
    expect(authStore.isLogin).toBe(false)
    expect(push).toHaveBeenCalledTimes(2)
    expect(notify).toHaveBeenCalledTimes(2)
  })
})
