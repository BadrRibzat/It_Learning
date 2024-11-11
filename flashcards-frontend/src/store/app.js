export default {
  namespaced: true,
  state: () => ({
    notification: {
      show: false,
      message: '',
      type: 'info'
    },
    loading: false
  }),
  mutations: {
    SET_NOTIFICATION(state, { show, message, type }) {
      state.notification = { show, message, type };
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    }
  },
  actions: {
    showNotification({ commit }, { message, type = 'info', duration = 3000 }) {
      commit('SET_NOTIFICATION', { show: true, message, type });
      
      setTimeout(() => {
        commit('SET_NOTIFICATION', { show: false, message: '', type: 'info' });
      }, duration);
    },
    startLoading({ commit }) {
      commit('SET_LOADING', true);
    },
    stopLoading({ commit }) {
      commit('SET_LOADING', false);
    }
  }
};
