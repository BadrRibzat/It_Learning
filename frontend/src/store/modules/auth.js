import { authService } from '../../api/services/authService';

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
};

const actions = {
  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData);
      commit('setToken', response.access);
      commit('setUser', response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials);
      commit('setToken', response.access);
      commit('setUser', response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  async logout({ commit }) {
    try {
      await authService.logout();
      commit('setToken', null);
      commit('setUser', null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  async fetchUser({ commit }) {
    try {
      const user = await authService.fetchUser();
      commit('setUser', user);
    } catch (error) {
      console.error('Fetch user failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  setUser(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
