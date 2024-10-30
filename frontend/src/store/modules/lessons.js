import { lessonService } from '@/api/services/lessons';
import { levelService } from '@/api/services/levels';

export default {
  namespaced: true,
  state: {
    levels: [],
    lessons: [],
    currentLesson: null,
    flashcards: [],
    quizzes: [],
    userProgress: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_LEVELS(state, levels) {
      state.levels = levels;
    },
    SET_LESSONS(state, lessons) {
      state.lessons = lessons;
    },
    SET_CURRENT_LESSON(state, lesson) {
      state.currentLesson = lesson;
    },
    SET_FLASHCARDS(state, flashcards) {
      state.flashcards = flashcards;
    },
    SET_QUIZZES(state, quizzes) {
      state.quizzes = quizzes;
    },
    SET_USER_PROGRESS(state, progress) {
      state.userProgress = progress;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchLevel({ commit }, levelId) {
      try {
        commit('SET_LOADING', true);
        const { data } = await levelService.getLevel(levelId);
        commit('SET_CURRENT_LEVEL', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch level');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchLessons({ commit }, levelId) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getLessons(levelId);
        commit('SET_LESSONS', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch lessons');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchLesson({ commit }, lessonId) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getLesson(lessonId);
        commit('SET_CURRENT_LESSON', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch lesson');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchFlashcards({ commit }, lessonId) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getFlashcards(lessonId);
        commit('SET_FLASHCARDS', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch flashcards');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchQuizzes({ commit }, lessonId) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getQuizzes(lessonId);
        commit('SET_QUIZZES', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch quizzes');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async submitFlashcard({ commit }, { flashcardId, answer }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.submitFlashcard(flashcardId, answer);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to submit flashcard');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async submitQuiz({ commit }, { quizId, answers }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.submitQuiz(quizId, answers);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to submit quiz');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchUserProgress({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getUserProgress();
        commit('SET_USER_PROGRESS', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user progress');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchRecommendedLessons({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await lessonService.getRecommendedLessons();
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch recommended lessons');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateCurrentLesson({ commit }, lessonId) {
      try {
        commit('SET_LOADING', true);
        await lessonService.updateCurrentLesson(lessonId);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update current lesson');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    allLevels: (state) => state.levels,
    allLessons: (state) => state.lessons,
    currentLesson: (state) => state.currentLesson,
    allFlashcards: (state) => state.flashcards,
    allQuizzes: (state) => state.quizzes,
    userProgress: (state) => state.userProgress,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
