export function useAuth() {
  const router = useRouter()

  function logout() {
    router.push({ path: '/auth/sign-in' })
  }

  function toHome() {
    router.push({ path: '/workspace' })
  }

  function login() {
    toHome()
  }

  return {
    logout,
    login,
  }
}
