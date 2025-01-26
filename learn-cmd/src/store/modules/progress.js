import ProgressService from '@/services/api/ProgressService';
import { NotificationService } from '@/utils/NotificationService';

export default {
  namespaced: true,

  state: {
    lessonProgress: {},
    overallProgress: null,
    flashcardProgress: null,
    quizProgress: null,
    levelProgress: null,
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
    SET_OVERALL_PROGRESS(state, progress) {
      state.overallProgress = progress;
    },
    SET_FLASHCARD_PROGRESS(state, progress) {
      state.flashcardProgress = progress;
    },
    SET_QUIZ_PROGRESS(state, progress) {
      state.quizProgress = progress;
    },
    SET_LEVEL_PROGRESS(state, progress) {
      state.levelProgress = progress;
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

    async fetchOverallProgress({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.getOverallProgress();
        commit('SET_OVERALL_PROGRESS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch overall progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchFlashcardProgress({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.getFlashcardProgress();
        commit('SET_FLASHCARD_PROGRESS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch flashcard progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchQuizProgress({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.getQuizProgress();
        commit('SET_QUIZ_PROGRESS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch quiz progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchLevelProgress({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.getLevelProgress();
        commit('SET_LEVEL_PROGRESS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch level progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async trackProgress({ commit }, progressData) {
      commit('SET_LOADING', true);
      try {
        const response = await ProgressService.trackProgress(progressData);
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
    overallProgress: state => state.overallProgress,
    flashcardProgress: state => state.flashcardProgress,
    quizProgress: state => state.quizProgress,
    levelProgress: state => state.levelProgress,
    isLoading: state => state.loading,
    error: state => state.error
  }
};
