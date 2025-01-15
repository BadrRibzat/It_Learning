import { Module } from "vuex";
import { RootState } from "@/store";
import api from "@/api";

export interface Lesson {
  id: number;
  title: string;
  level: number;
  level_order: number;
  content: string;
  difficulty: string;
}

export interface LessonsState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
}

const lessonsModule: Module<LessonsState, RootState> = {
  namespaced: true,
  state: {
    lessons: [],
    currentLesson: null,
  },
  mutations: {
    SET_LESSONS(state, lessons: Lesson[]) {
      state.lessons = lessons;
    },
    SET_CURRENT_LESSON(state, lesson: Lesson) {
      state.currentLesson = lesson;
    },
  },
  actions: {
    async fetchLessons({ commit }, levelId?: number) {
      const response = await api.get('/lessons/', { params: { level: levelId } });
      commit('SET_LESSONS', response.data);
    },
    async fetchLessonById({ commit }, id: number) {
      const response = await api.get(`/lessons/${id}/`);
      commit('SET_CURRENT_LESSON', response.data);
    },
    async fetchRecommendedLessons({ commit }) {
      const response = await api.get('/recommended-lessons/');
      commit('SET_LESSONS', response.data);
    },
  },
};

export default lessonsModule;
