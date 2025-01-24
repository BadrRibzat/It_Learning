import AuthService from '@/services/api/AuthService';
import { NotificationService } from '@/utils/NotificationService';


const state = {
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_AUTH(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
};

const actions = {
  async register({ commit }, userData) {
    const user = await AuthService.register(userData);
    commit('SET_USER', user);
    commit('SET_AUTH', true);
  },

  async login({ commit }, credentials) {
    const user = await AuthService.login(credentials);
    commit('SET_USER', user);
    commit('SET_AUTH', true);
  },

  async logout({ commit }) {
    await AuthService.logout();
    commit('SET_USER', null);
    commit('SET_AUTH', false);
  },

  async verifyEmail({ commit }, token) {
    const user = await AuthService.verifyEmail(token);
    commit('SET_USER', user);
  },

  async requestPasswordReset({ commit }, email) {
    await AuthService.requestPasswordReset(email);
  },

  async confirmPasswordReset({ commit }, { token, newPassword }) {
    await AuthService.confirmPasswordReset(token, newPassword);
  },

  async setupMFA({ commit }) {
    const mfaData = await AuthService.setupMFA();
    return mfaData;
  },

  async verifyMFA({ commit }, token) {
    await AuthService.verifyMFA(token);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
