import { Module } from "vuex";
import api from "@/api";

interface ProgressState {
  userProgress: object | null; // Specify a more appropriate type if possible
}

const progressModule: Module<ProgressState, any> = {
  namespaced: true,
  state: {
    userProgress: null,
  },
  mutations: {
    SET_USER_PROGRESS(state, progress: object) {
      state.userProgress = progress;
    },
  },
  actions: {
    async fetchUserProgress({ commit }) {
      const response = await api.get("/user-progress/");
      commit("SET_USER_PROGRESS", response.data);
    },
  },
};

export default progressModule;
