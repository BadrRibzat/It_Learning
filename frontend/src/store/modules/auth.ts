import { Module } from "vuex";
import { login, logout, fetchUserProfile } from "@/api/authService";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const authModule: Module<AuthState, any> = {
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
    SET_TOKENS(state, { access, refresh }: { access: string; refresh: string }) {
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
      const response = await login(credentials);
      commit("SET_TOKENS", { access: response.access, refresh: response.refresh });
      commit("SET_USER", response.user);
      return response;
    },
    async logout({ commit }) {
      await logout();
      commit("CLEAR_AUTH");
    },
    async fetchUserProfile({ commit }) {
      const userData = await fetchUserProfile();
      commit("SET_USER", userData);
    },
  },
};

export default authModule;
