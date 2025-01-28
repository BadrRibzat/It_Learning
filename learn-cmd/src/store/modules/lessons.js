import LessonService from '@/services/api/LessonService';
import { NotificationService } from '@/utils/NotificationService';

export default {
  namespaced: true,

  state: {
  currentLevel: 'beginner',
  levelProgression: {
    current_level: 'beginner',
    next_level: 'intermediate',
    progress: 0,
    unlocked_levels: ['beginner']
  },
    currentLesson: null,
    lessons: [],
    flashcards: [],
    currentFlashcard: null,
    quizzes: [],
    currentQuiz: null,
    levelTest: null,
    loading: false,
    error: null
  },

  mutations: {
  SET_LEVEL_PROGRESSION(state, progression) {
    state.levelProgression = progression || {
      current_level: 'beginner',
      next_level: 'intermediate',
      progress: 0,
      unlocked_levels: ['beginner']
    };
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
  SET_CURRENT_FLASHCARD(state, flashcard) {
    state.currentFlashcard = flashcard;
  },
  SET_QUIZZES(state, quizzes) {
    state.quizzes = quizzes;
  },
  SET_CURRENT_QUIZ(state, quiz) {
    state.currentQuiz = quiz;
  },
  SET_LEVEL_TEST(state, test) {
    state.levelTest = test;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_CURRENT_STATE(state) {
    state.currentFlashcard = null;
    state.currentQuiz = null;
    state.levelTest = null;
  }
},

  actions: {
    // Level Progression
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

    // Lessons
    async getLessonsByLevel({ commit }, level) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLessonsByLevel(level);
        commit('SET_LESSONS', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch lessons');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getLesson({ commit }, lessonId) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLesson(lessonId);
        commit('SET_CURRENT_LESSON', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch lesson');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Flashcards
    async getNextFlashcard({ commit }, { lessonId }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getFlashcardsForLesson(lessonId);
        commit('SET_CURRENT_FLASHCARD', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch flashcard');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitFlashcardAnswer({ commit }, { lessonId, answerData }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitFlashcardAnswer(lessonId, answerData);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit answer');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Quizzes
    async getQuizQuestions({ commit }, { lessonId }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getQuizForLesson(lessonId);
        commit('SET_CURRENT_QUIZ', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch quiz');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitQuiz({ commit }, { lessonId, answers }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitQuizAnswers(lessonId, answers);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit quiz');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Level Tests
    async checkLevelTestEligibility({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLevelTest(level);
        return response.eligible;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to check test eligibility');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getLevelTest({ commit }, { level }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.getLevelTest(level);
        commit('SET_LEVEL_TEST', response);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to fetch level test');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async submitLevelTest({ commit, dispatch }, { level, answers }) {
      commit('SET_LOADING', true);
      try {
        const response = await LessonService.submitLevelTest(level, answers);
        if (response.passed) {
          await dispatch('fetchLevelProgression');
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to submit test');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Cleanup
    clearCurrentState({ commit }) {
      commit('CLEAR_CURRENT_STATE');
    }
  },

  getters: {
    currentLevel: state => state.levelProgression?.current_level,
    nextLevel: state => state.levelProgression?.next_level,
    unlockedLevels: state => state.levelProgression?.unlocked_levels || [],
    levelProgress: state => {
      const progression = state.levelProgression;
      if (!progression) return 0;
      return Math.round((progression.progress || 0) * 100);
    },
    isLevelUnlocked: state => level => {
      if (level === 'beginner') return true;
      return state.levelProgression?.unlocked_levels?.includes(level) || false;
    },
    canTakeLevelTest: state => level => {
      if (level === 'beginner') return false;
      const lessons = state.lessons.filter(lesson => lesson.level === level);
      return lessons.every(lesson => 
        lesson.progress?.completed_flashcards === lesson.total_flashcards &&
        lesson.progress?.quiz_completed
      );
    },
    isLoading: state => state.loading,
    error: state => state.error
  }
};
