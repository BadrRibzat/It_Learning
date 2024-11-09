import authService from '@/services/api/auth';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials);
      const { access, refresh, user } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      commit('setToken', access);
      commit('setUser', user);
      commit('setAuthenticated', true);
      commit('setError', null);
      return response;
    } catch (error) {
      console.error('Login failed', error);
      commit('setError', error.response?.data?.detail || 'Login failed');
      throw error;
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData);
      const { access, refresh, user } = response.data;
    
    // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
    
    // Update store
      commit('setToken', access);
      commit('setUser', user);
      commit('setAuthenticated', true);
      commit('setError', null);
    
    // Return for chaining
      return response;
  }   catch (error) {
      console.error('Registration failed', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Registration failed';
      commit('setError', errorMessage);
      throw error;
    }
  },

  async logout({ commit }) {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
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
      return access;
    } catch (error) {
      console.error('Token refresh failed', error);
      commit('setToken', null);
      commit('setUser', null);
      commit('setAuthenticated', false);
      commit('setError', error.response?.data?.detail || 'Token refresh failed');
      throw error;
    }
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
  },
  setUser(state, user) {
    state.user = user;
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
