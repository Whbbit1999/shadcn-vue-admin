import env from '@/utils/env'

export const API_BASE_URL = `${env.VITE_SERVER_API_URL}${env.VITE_SERVER_API_PREFIX ?? '/api'}` as const
export const API_TIMEOUT = env.VITE_SERVER_API_TIMEOUT
