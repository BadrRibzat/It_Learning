import authService from '@/services/api/auth';
import router from '@/router';

export default {
  namespaced: true,
  state: () => ({
    user: (() => {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
        return null;
      }
    })(),
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    error: null
  }),
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials);
        commit('setUser', response.user || null);
        commit('setToken', response.access || null);
        commit('setRefreshToken', response.refresh || null);
        return response;
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Login failed';
        commit('setError', errorMessage);
        throw error;
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData);
        router.push('/auth/login');
        return response;
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Registration failed';
        commit('setError', errorMessage);
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
        commit('setToken', response.data.access || null);
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
      if (user) {
        try {
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Error storing user in localStorage:', error);
        }
      } else {
        localStorage.removeItem('user');
      }
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = !!token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
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
