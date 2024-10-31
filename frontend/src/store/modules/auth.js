import { authService } from '@/api/services/auth';
import router from '@/router';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_USER(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        console.log('Attempting login with:', credentials);
        const { data } = await authService.login(credentials);
        console.log('Login response:', data);
        commit('SET_TOKEN', data.access);
        commit('SET_USER', data.user);
        await dispatch('profile/fetchProfile', null, { root: true });
        router.push('/dashboard');
        return { success: true };
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        commit('SET_ERROR', error.response?.data?.detail || 'Login failed');
        return { success: false, error: error.response?.data?.detail || 'Login failed' };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async logout({ commit }) {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
        commit('profile/SET_PROFILE', null, { root: true });
        router.push('/auth/login');
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
