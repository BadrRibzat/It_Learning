export const errorInterceptor = (error) => {
  if (error.response) {
    // Handle specific error cases
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear user session
        store.dispatch('auth/logout')
        break
      case 403:
        // Forbidden - user doesn't have required permissions
        router.push('/forbidden')
        break
      case 404:
        // Not found
        router.push('/not-found')
        break
      case 422:
        // Validation errors
        return Promise.reject({
          ...error,
          message: error.response.data.errors || 'Validation failed'
        })
      case 500:
        // Server error
        router.push('/error')
        break
    }
  }
  return Promise.reject(error)
}

