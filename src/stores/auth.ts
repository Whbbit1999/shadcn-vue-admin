import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', () => {
  const isLogin = shallowRef(false)

  return {
    isLogin,
  }
})
