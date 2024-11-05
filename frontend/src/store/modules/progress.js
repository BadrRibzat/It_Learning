import api from "@/api";

export default {
  namespaced: true,
  state: {
    userProgress: null,
  },
  mutations: {
    SET_USER_PROGRESS(state, progress) {
      state.userProgress = progress;
    },
  },
  actions: {
    async fetchUserProgress({ commit }) {
      try {
        const response = await api.get("/user-progress/");
        commit("SET_USER_PROGRESS", response.data);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    },
  },
};
