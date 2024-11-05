import api from "@/api";

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKENS(state, { access, refresh }) {
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
    async login({ commit }, credentials) {
      const response = await api.post("/login/", credentials);
      commit("SET_TOKENS", response.data);
      return response;
    },
    async logout({ commit }) {
      await api.post("/logout/");
      commit("CLEAR_AUTH");
    },
    async fetchUserProfile({ commit }) {
      try {
        const response = await api.get("/profile/");
        commit("SET_USER", response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
  },
};
