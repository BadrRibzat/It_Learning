import lessonsService from '@/services/api/lessons';

export default {
  namespaced: true,
  state: () => ({
    lessons: [],
    currentLesson: null,
    recommendedLessons: [],
  }),
  actions: {
    async fetchLessons({ commit }, levelId) {
    try {
      const response = await lessonsService.getLessons(levelId);
      commit('setLessons', response.data);
      return response;
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      throw error;
    }
  },
    async fetchLesson({ commit }, id) {
      try {
        const response = await lessonsService.getLesson(id);
        commit('setCurrentLesson', response.data);
      } catch (error) {
        console.error('Failed to fetch lesson', error);
        throw error;
      }
    },
    async recommendNextLesson({ commit }) {
      try {
        const response = await lessonsService.recommendNextLesson();
        commit('setRecommendedLessons', response.data);
      } catch (error) {
        console.error('Failed to fetch recommended lessons', error);
        throw error;
      }
    },
    async updateCurrentLesson({ commit }, lessonId) {
      try {
        const response = await lessonsService.updateCurrentLesson(lessonId);
        return response;
      } catch (error) {
        console.error('Failed to update current lesson', error);
        throw error;
      }
    },
  },
  mutations: {
    setLessons(state, lessons) {
      state.lessons = lessons;
    },
    setCurrentLesson(state, lesson) {
      state.currentLesson = lesson;
    },
    setRecommendedLessons(state, lessons) {
      state.recommendedLessons = lessons;
    },
  }
};
