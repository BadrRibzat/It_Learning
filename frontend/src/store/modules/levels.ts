import { Module } from "vuex";
import { RootState } from "@/store";
import api from "@/api";

export interface Level {
  id: number;
  name: string;
  level_order: number;
}

export interface LevelsState {
  levels: Level[];
}

const levelsModule: Module<LevelsState, RootState> = {
  namespaced: true,
  state: {
    levels: [],
  },
  mutations: {
    SET_LEVELS(state, levels: Level[]) {
      state.levels = levels;
    },
  },
  actions: {
    async fetchLevels({ commit }) {
      try {
        const response = await api.get("/levels/");
        commit("SET_LEVELS", response.data);
        return response;
      } catch (error) {
        console.error("Error fetching levels:", error);
        throw error;
      }
    },
  },
};

export default levelsModule;
