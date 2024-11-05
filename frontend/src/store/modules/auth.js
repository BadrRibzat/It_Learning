import api from '@/api';

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKENS(state, { access, refresh }) {
      state.token = access;
      state.refreshToken = refresh;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/login/', credentials);
        commit('SET_TOKENS', response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async logout({ commit }) {
      try {
        await api.post('/logout/');
        commit('CLEAR_AUTH');
      } catch (error) {
        console.error('Logout error:', error);
        commit('CLEAR_AUTH');
      }
    },
  },
};
