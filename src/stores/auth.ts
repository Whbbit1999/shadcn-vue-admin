import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useAuthStore = defineStore('user', () => {
  const isLogin = shallowRef(false)

  return {
    isLogin,
  }
})
