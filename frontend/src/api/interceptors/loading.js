import { store } from '@/store'

export const loadingInterceptor = {
  request: (config) => {
    store.commit('SET_LOADING', true)
    return config
  },
  response: (response) => {
    store.commit('SET_LOADING', false)
    return response
  },
  error: (error) => {
    store.commit('SET_LOADING', false)
    return Promise.reject(error)
  }
}
