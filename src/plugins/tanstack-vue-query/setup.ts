import type { App } from 'vue'

import { MutationCache, QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { FetchError } from 'ofetch'
import { toast } from 'vue-sonner'

function handleError(error: Error) {
  if (error instanceof FetchError && error.status === 401)
    return

  const message = error instanceof FetchError ? error.data?.message || error.statusText : error.message
  toast.error(typeof message === 'string' && message ? message : 'Request failed')
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

export function setupTanstackVueQuery(app: App) {
  app.use(VueQueryPlugin, {
    queryClient,
  })
}
