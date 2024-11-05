import api from "@/api";

export default {
  namespaced: true,
  state: {
    lessons: [],
    currentLesson: null,
  },
  mutations: {
    SET_LESSONS(state, lessons) {
      state.lessons = lessons;
    },
    SET_CURRENT_LESSON(state, lesson) {
      state.currentLesson = lesson;
    },
  },
  actions: {
    async fetchLessons({ commit }) {
      try {
        const response = await api.get("/lessons/");
        commit("SET_LESSONS", response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    },
    async fetchLessonById({ commit }, id) {
      try {
        const response = await api.get(`/lessons/${id}/`);
        commit("SET_CURRENT_LESSON", response.data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    },
  },
};
