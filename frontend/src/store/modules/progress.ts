import { Module } from "vuex";
import { RootState } from "@/store";
import api from "@/api";

export interface UserProgress {
  id: number;
  user: number;
  lesson: number;
  completed: boolean;
  date_completed: string | null;
  correct_answers: number;
  total_questions: number;
}

export interface ProgressState {
  userProgress: UserProgress[];
}

const progressModule: Module<ProgressState, RootState> = {
  namespaced: true,
  state: {
    userProgress: [],
  },
  mutations: {
    SET_USER_PROGRESS(state, progress: UserProgress[]) {
      state.userProgress = progress;
    },
  },
  actions: {
    async fetchUserProgress({ commit }) {
      const response = await api.get("/user-progress/");
      commit("SET_USER_PROGRESS", response.data);
    },
    async updateUserProgress(
      { dispatch },
      { lessonId, completed, correctAnswers, totalQuestions }
    ) {
      await api.post("/user-progress/", {
        lesson: lessonId,
        completed,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
      });
      dispatch("fetchUserProgress");
    },
  },
};

export default progressModule;
