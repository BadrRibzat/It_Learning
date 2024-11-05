import { Module } from "vuex";
import api from "@/api";

interface User {
  email: string;
  // Add other user properties as needed
}

interface Credentials {
  email: string;
  password: string;
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
    async login({ commit }, credentials: Credentials) {
      const response = await api.post("/login/", credentials);
      commit("SET_TOKENS", response.data);
      commit("SET_USER", response.data.user);
      return response;
    },
    async logout({ commit }) {
      await api.post("/logout/");
      commit("CLEAR_AUTH");
    },
    async fetchUserProfile({ commit }) {
      const response = await api.get("/profile/");
      commit("SET_USER", response.data);
    },
  },
};

export default authModule;
