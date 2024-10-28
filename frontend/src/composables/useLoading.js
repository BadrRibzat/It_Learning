import { ref } from 'vue'

export function useLoading(initialState = false) {
  const isLoading = ref(initialState)
  const error = ref(null)

  const withLoading = async (fn) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await fn()
      return result
    } catch (e) {
      error.value = e
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    withLoading
  }
}
