import lessonsService from '@/services/api/lessons';

export default {
  namespaced: true,
  state: () => ({
    lessons: [],
    currentLesson: null,
    recommendedLessons: [],
  }),
  actions: {
    fetchLessons({ commit }, levelId) {
      return lessonsService.getLessons(levelId)
        .then(response => {
          commit('setLessons', response.data);
          return response;
        })
        .catch(error => {
          console.error('Failed to fetch lessons:', error);
          throw error;
        });
    },
    
    fetchLesson({ commit }, id) {
      return lessonsService.getLesson(id)
        .then(response => {
          commit('setCurrentLesson', response.data);
          return response;
        })
        .catch(error => {
          console.error('Failed to fetch lesson', error);
          throw error;
        });
    },
    
    recommendNextLesson({ commit }) {
      return lessonsService.recommendNextLesson()
        .then(response => {
          commit('setRecommendedLessons', response.data);
          return response;
        })
        .catch(error => {
          console.error('Failed to fetch recommended lessons', error);
          throw error;
        });
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
