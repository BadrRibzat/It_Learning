import AuthService from '@/services/api/AuthService';
import router from '@/router';

export default {
  namespaced: true,
  
  state: {
    token: localStorage.getItem('token') || null,
    user: null,
    isAuthenticated: !!localStorage.getItem('token')
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      state.isAuthenticated = !!token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    }
  },

  actions: {
    async register({ commit }, userData) {
      try {
        const response = await AuthService.register(userData);
        router.push('/auth/login');
        return response;
      } catch (error) {
        throw error;
      }
    },

    async login({ commit }, credentials) {
      try {
        const response = await AuthService.login(credentials);
        commit('SET_TOKEN', response.access_token);
        router.push('/profile');
        return response;
      } catch (error) {
        throw error;
      }
    },

    async logout({ commit }) {
      try {
        await AuthService.logout();
        commit('CLEAR_AUTH');
        router.push('/auth/login');
      } catch (error) {
        commit('CLEAR_AUTH');
        router.push('/auth/login');
        throw error;
      }
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    token: state => state.token
  }
};
