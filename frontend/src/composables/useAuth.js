import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useStore()
  const router = useRouter()

  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const currentUser = computed(() => store.getters['auth/currentUser'])
  const loading = computed(() => store.getters['auth/loading'])
  const error = computed(() => store.getters['auth/error'])

  const login = async (credentials) => {
    try {
      await store.dispatch('auth/login', credentials)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    await store.dispatch('auth/logout')
    router.push('/login')
  }

  const register = async (userData) => {
    try {
      await store.dispatch('auth/register', userData)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  return {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    logout,
    register
  }
}

