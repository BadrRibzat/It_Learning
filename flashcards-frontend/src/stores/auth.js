import authService from '@/services/api/auth';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const actions = {
  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData);
      const { access, refresh } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      commit('setToken', access);
      commit('setUser', response.data);
      commit('setAuthenticated', true);
      commit('setError', null);
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      commit('setError', errorMessage);
      throw error;
    }
  },

  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials);
      const { access, refresh } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      commit('setToken', access);
      commit('setUser', response.data);
      commit('setAuthenticated', true);
      commit('setError', null);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      commit('setError', error.response?.data?.detail || 'Login failed');
      throw error;
    }
  },

  async logout({ commit }) {
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
    }
  },

  async refreshToken({ commit }) {
    try {
      const response = await authService.refreshToken();
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      commit('setToken', access);
      commit('setError', null);
      
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      commit('setToken', null);
      commit('setUser', null);
      commit('setAuthenticated', false);
      commit('setError', error.response?.data?.detail || 'Token refresh failed');
      throw error;
    }
  },
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
};

export default {
  namespaced: true,
  state: initialState,
  actions,
  mutations,
};
