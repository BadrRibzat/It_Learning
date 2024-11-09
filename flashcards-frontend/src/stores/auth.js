import authService from '@/services/api/auth';
import router from '@/router';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  loading: false
};

const actions = {
  async register({ commit }, userData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await authService.register(userData);
      const { access, refresh, user } = response;

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      commit('setToken', access);
      commit('setUser', user);
      commit('setAuthenticated', true);

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Registration failed';
      commit('setError', errorMessage);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async login({ commit }, credentials) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await authService.login(credentials);
      const { access, refresh, user } = response;

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      commit('setToken', access);
      commit('setUser', user);
      commit('setAuthenticated', true);

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      commit('setError', errorMessage);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async logout({ commit }) {
    commit('setLoading', true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      commit('setToken', null);
      commit('setUser', null);
      commit('setAuthenticated', false);
      commit('setError', null);
      commit('setLoading', false);
      router.push('/');
    }
  },

  async refreshToken({ commit, dispatch }) {
    try {
      const response = await authService.refreshToken();
      const { access } = response.data;

      localStorage.setItem('token', access);
      commit('setToken', access);

      return response;
    } catch (error) {
      await dispatch('logout');
      throw error;
    }
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
  },
  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setError(state, error) {
    state.error = error;
  },
  setLoading(state, loading) {
    state.loading = loading;
  }
};

export default {
  namespaced: true,
  state: initialState,
  actions,
  mutations
};
