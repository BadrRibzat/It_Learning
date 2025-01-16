import AuthService from '@/services/api/AuthService';
import router from '@/router';
import { NotificationService } from '@/utils/NotificationService';

const state = {
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isLoading: false,
  error: null,
};

const mutations = {
  SET_USER(state, user) {
    console.log('Setting user:', user); // Debug logging
    state.user = user;
  },
  SET_TOKENS(state, { access, refresh }) {
    console.log('Setting tokens:', { access, refresh }); // Debug logging
    state.accessToken = access;
    state.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  CLEAR_TOKENS(state) {
    console.log('Clearing tokens'); // Debug logging
    state.accessToken = null;
    state.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async register({ commit }, userData) {
    commit('SET_LOADING', true);
    try {
      const response = await AuthService.register(userData);
      commit('SET_USER', response.user);
      commit('SET_TOKENS', { access: response.access, refresh: response.refresh });
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async login({ commit }, credentials) {
    commit('SET_LOADING', true);
    try {
      const response = await AuthService.login(credentials);
      commit('SET_USER', response.user);
      commit('SET_TOKENS', { access: response.access, refresh: response.refresh });
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async logout({ commit, state }) {
    commit('SET_LOADING', true);
    try {
      if (!state.refreshToken) {
        throw new Error('No refresh token found. Please log in again.');
      }
      await AuthService.logout(state.refreshToken);
    } catch (error) {
      if (error.response?.status === 401) {
        NotificationService.showInfo('Session expired. Please log in again.');
      } else {
        NotificationService.showError(error.message || 'Logout failed. Please try again.');
      }
    } finally {
      commit('CLEAR_TOKENS');
      commit('SET_USER', null);
      router.push({ name: 'login' });
      commit('SET_LOADING', false);
    }
  },

  async forgotPassword({ commit }, email) {
    commit('SET_LOADING', true);
    try {
      await AuthService.forgotPassword(email);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async resetPassword({ commit }, { token, newPassword }) {
    commit('SET_LOADING', true);
    try {
      await AuthService.resetPassword(token, newPassword);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async verifyEmail({ commit }, token) {
    commit('SET_LOADING', true);
    try {
      await AuthService.verifyEmail(token);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async resendVerificationEmail({ commit }) {
    commit('SET_LOADING', true);
    try {
      await AuthService.resendVerificationEmail();
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async setupMFA({ commit }) {
    commit('SET_LOADING', true);
    try {
      await AuthService.setupMFA();
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const getters = {
  isAuthenticated: (state) => !!state.accessToken,
  user: (state) => state.user,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
