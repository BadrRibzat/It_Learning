import lessonsService from '@/services/api/lessons';

export default {
  namespaced: true,
  state: () => ({
    lessons: [],
    currentLesson: null,
    recommendedLessons: [],
    lessonDetails: null,
    loading: false,
    error: null
  }),
  
  mutations: {
    SET_LESSONS(state, lessons) {
      state.lessons = lessons;
    },
    SET_CURRENT_LESSON(state, lesson) {
      state.currentLesson = lesson;
    },
    SET_RECOMMENDED_LESSONS(state, lessons) {
      state.recommendedLessons = lessons;
    },
    SET_LESSON_DETAILS(state, details) {
      state.lessonDetails = details;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchLessons({ commit }, levelId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await lessonsService.getLessons(levelId);
        commit('SET_LESSONS', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch lessons');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchLesson({ commit }, id) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await lessonsService.getLesson(id);
        commit('SET_CURRENT_LESSON', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch lesson');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchLessonDetails({ commit }, id) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const details = await lessonsService.getLessonDetails(id);
        commit('SET_LESSON_DETAILS', details);
        commit('SET_CURRENT_LESSON', details.lesson);
        return details;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch lesson details');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async recommendNextLesson({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await lessonsService.recommendNextLesson();
        commit('SET_RECOMMENDED_LESSONS', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch recommended lessons');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};
