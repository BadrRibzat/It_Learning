import authService from '@/services/api/auth';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
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
      return response;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData);
      const { access, refresh, user } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      commit('setToken', access);
      commit('setUser', user);
      commit('setAuthenticated', true);
      return response;
    } catch (error) {
      console.error('Registration failed', error);
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
    }
  },

  async refreshToken({ commit }) {
    try {
      const response = await authService.refreshToken();
      const { access } = response.data;
      localStorage.setItem('token', access);
      commit('setToken', access);
      return access;
    } catch (error) {
      console.error('Token refresh failed', error);
      commit('setToken', null);
      commit('setUser', null);
      commit('setAuthenticated', false);
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
};

export default {
  namespaced: true,
  state: initialState,
  actions,
  mutations,
};
