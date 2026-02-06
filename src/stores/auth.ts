import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', () => {
  const isLogin = ref(false)
  const token = ref('')
  const username = ref('')

  function setAuth(newToken: string, newUsername: string) {
    token.value = newToken
    username.value = newUsername
    isLogin.value = true
  }

  function clearAuth() {
    token.value = ''
    username.value = ''
    isLogin.value = false
  }

  return {
    isLogin,
    token,
    username,
    setAuth,
    clearAuth,
  }
}, {
  persist: true,
})
