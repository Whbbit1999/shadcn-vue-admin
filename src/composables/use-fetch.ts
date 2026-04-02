/**
 * ofetch: https://github.com/unjs/ofetch
 */
import { ofetch } from 'ofetch'

import { API_BASE_URL, API_TIMEOUT } from '@/constants/app-config'

const apiFetch = ofetch.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT ?? false,
  onRequest: (_request) => {},
  onRequestError: (_error) => {},
  onResponse: (_response) => {},
  onResponseError: (_error) => {},
})

export function useApiFetch() {
  return {
    apiFetch,
  }
}
