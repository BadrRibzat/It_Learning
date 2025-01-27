import ProgressService from '@/services/api/ProgressService';
import { NotificationService } from '@/utils/NotificationService';

export default {
  namespaced: true,

  state: {
    lessonProgress: {},
    loading: false,
    error: null
  },

  mutations: {
    SET_LESSON_PROGRESS(state, { lessonId, progress }) {
      state.lessonProgress = {
        ...state.lessonProgress,
        [lessonId]: progress
      };
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchLessonProgress({ commit }, lessonId) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.getLessonProgress(lessonId);
        commit('SET_LESSON_PROGRESS', { lessonId, progress: response });
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch lesson progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async trackProgress({ commit }, { lessonId, flashcardId, isCorrect }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.trackFlashcardProgress({
          lessonId,
          flashcardId,
          isCorrect
        });
        await this.dispatch('progress/fetchLessonProgress', lessonId);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to track progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    getLessonProgress: state => lessonId => state.lessonProgress[lessonId],
    isLoading: state => state.loading,
    error: state => state.error
  }
};
