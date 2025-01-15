import { Module } from 'vuex';
import { RootState } from '@/store';
import api from '@/api';
import { User } from '@/types/api';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  },
  mutations: {
    SET_USER(state, user: User) {
      state.user = user;
    },
    SET_TOKENS(
      state,
      { access, refresh }: { access: string; refresh: string }
    ) {
      state.token = access;
      state.refreshToken = refresh;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  actions: {
    async login({ commit }, credentials: { email: string; password: string }) {
      const response = await api.post<{ access: string; refresh: string; user: User }>('/login/', credentials);
      commit('SET_TOKENS', { access: response.data.access, refresh: response.data.refresh });
      commit('SET_USER', response.data.user);
      return response;
    },
    async logout({ commit }) {
      await api.post('/logout/');
      commit('CLEAR_AUTH');
    },
    async fetchUserProfile({ commit }) {
      const response = await api.get<User>('/profile/');
      commit('SET_USER', response.data);
    },
    async register({ commit }, userData: { username: string; email: string; password: string }) {
      const response = await api.post<User>('/register/', userData);
      return response;
    },
  },
};

export default authModule;
