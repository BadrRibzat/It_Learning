import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    progress: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setProgress(state, progress) {
      state.progress = progress
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setUser', null)
    },
    updateProgress({ commit }, progress) {
      commit('setProgress', progress)
    },
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
    progress: state => state.progress,
  },
})
