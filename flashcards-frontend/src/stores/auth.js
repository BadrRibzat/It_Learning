import authService from '@/services/api/auth';
import router from '@/router';

export default {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    error: null
  }),
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials);
        commit('setUser', response.user);
        commit('setToken', response.access);
        commit('setRefreshToken', response.refresh);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.detail || 'Login failed');
        throw error;
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData);
        router.push('/auth/login');
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.detail || 'Registration failed');
        throw error;
      }
    },

    async logout({ commit }) {
      try {
        await authService.logout();
      } finally {
        commit('clearAuth');
        router.push('/auth/login');
      }
    },

    async refreshToken({ commit }) {
      try {
        const response = await authService.refreshToken();
        commit('setToken', response.data.access);
        return response;
      } catch (error) {
        commit('clearAuth');
        throw error;
      }
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    },
    setError(state, error) {
      state.error = error;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
};
