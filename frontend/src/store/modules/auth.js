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
    const response = await authService.register(userData);
    commit('setToken', response.access);
    commit('setUser', response);
    return response;
  },
  async login({ commit }, credentials) {
    const response = await authService.login(credentials);
    commit('setToken', response.access);
    commit('setUser', response);
    return response;
  },
  async logout({ commit }) {
    await authService.logout();
    commit('setToken', null);
    commit('setUser', null);
  },
  async fetchUser({ commit }) {
    const user = await authService.fetchUser();
    commit('setUser', user);
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
