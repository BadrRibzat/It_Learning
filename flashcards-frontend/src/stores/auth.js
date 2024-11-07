import { reactive } from 'vue';
import authService from '@/services/api/auth';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const state = reactive(initialState);

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials);
      const token = response.data.access;
      localStorage.setItem('token', token);
      commit('setToken', token);
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
      const token = response.data.access;
      localStorage.setItem('token', token);
      commit('setToken', token);
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
      localStorage.removeItem('token');
      commit('setToken', null);
      commit('setAuthenticated', false);
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
  },
  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setUser(state, user) {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
