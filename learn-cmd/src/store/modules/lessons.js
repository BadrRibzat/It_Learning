import LessonService from '@/services/api/LessonService';
import { NotificationService } from '@/utils/NotificationService';

export default {
  namespaced: true,

  state: {
    levelProgression: null,
    currentLesson: null,
    currentFlashcard: null,
    quizQuestions: [],
    testQuestions: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_LEVEL_PROGRESSION(state, progression) {
      state.levelProgression = progression;
    },
    SET_CURRENT_LESSON(state, lesson) {
      state.currentLesson = lesson;
    },
    SET_CURRENT_FLASHCARD(state, flashcard) {
      state.currentFlashcard = flashcard;
    },
    SET_QUIZ_QUESTIONS(state, questions) {
      state.quizQuestions = questions;
    },
    SET_TEST_QUESTIONS(state, questions) {
      state.testQuestions = questions;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchLevelProgression({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLevelProgression();
        commit('SET_LEVEL_PROGRESSION', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch level progression');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getNextFlashcard({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getNextFlashcard(level);
        commit('SET_CURRENT_FLASHCARD', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to load next flashcard');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitFlashcardAnswer({ commit }, { lessonId, answerData }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitFlashcardAnswer(
          lessonId,
          answerData
        );
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit answer');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getQuizQuestions({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getQuizQuestions(level);
        commit('SET_QUIZ_QUESTIONS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to load quiz questions');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitQuiz({ commit }, { level, answers }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitQuiz(level, answers);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit quiz');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async checkLevelTestEligibility({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.checkLevelTestEligibility(level);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to check test eligibility');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getLevelTestQuestions({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLevelTestQuestions(level);
        commit('SET_TEST_QUESTIONS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to load test questions');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitLevelTest({ commit }, { level, answers }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitLevelTest(level, answers);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit test');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    levelProgression: state => state.levelProgression,
    currentLesson: state => state.currentLesson,
    currentFlashcard: state => state.currentFlashcard,
    quizQuestions: state => state.quizQuestions,
    testQuestions: state => state.testQuestions,
    isLoading: state => state.loading,
    error: state => state.error
  }
};
