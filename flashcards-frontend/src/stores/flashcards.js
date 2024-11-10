import flashcardsService from '@/services/api/flashcards';

export default {
  namespaced: true,
  state: () => ({
    flashcards: [],
    currentFlashcard: null,
  }),
  actions: {
    async fetchFlashcards({ commit }, lessonId) {
      try {
        const response = await flashcardsService.getFlashcards(lessonId);
        commit('setFlashcards', response.data);
      } catch (error) {
        console.error('Failed to fetch flashcards', error);
        throw error;
      }
    },
    async fetchFlashcard({ commit }, id) {
      try {
        const response = await flashcardsService.getFlashcard(id);
        commit('setCurrentFlashcard', response.data);
      } catch (error) {
        console.error('Failed to fetch flashcard', error);
        throw error;
      }
    },
    async submitAnswer({ commit }, { id, answer }) {
      try {
        const response = await flashcardsService.submitFlashcard(id, answer);
        return response.data;
      } catch (error) {
        console.error('Failed to submit answer', error);
        throw error;
      }
    },
  },
  mutations: {
    setFlashcards(state, flashcards) {
      state.flashcards = flashcards;
    },
    setCurrentFlashcard(state, flashcard) {
      state.currentFlashcard = flashcard;
    },
  }
};
