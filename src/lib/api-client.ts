/**
 * ofetch: https://github.com/unjs/ofetch
 */
import { ofetch } from 'ofetch'
import { toast } from 'vue-sonner'

import { API_BASE_URL, API_TIMEOUT } from '@/constants/app-config'

/**
 * Clear the session and send the user back to sign-in when the API returns 401.
 * Imports are lazy to avoid a cycle (router -> pages -> services -> api-client).
 */
async function handleUnauthorized() {
  const [{ default: router }, { useAuthStore }, { default: pinia }] = await Promise.all([
    import('@/router'),
    import('@/stores/auth'),
    import('@/plugins/pinia/setup'),
  ])

  const authStore = useAuthStore(pinia)
  if (!authStore.isLogin)
    return

  authStore.isLogin = false
  toast.error('Your session has expired, please sign in again.')
  await router.push({ path: '/auth/sign-in' })
}

export const apiFetch = ofetch.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT ?? 5000,

  onResponseError: async ({ response }) => {
    if (response.status === 401)
      await handleUnauthorized()
  },
})
