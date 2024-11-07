import createBaseStore from './base';
import flashcardsService from '@/services/api/flashcards';

const initialState = {
  flashcards: [],
  currentFlashcard: null,
};

const { state, setState } = createBaseStore(initialState);

const actions = {
  async fetchFlashcards({ commit }) {
    try {
      const response = await flashcardsService.getFlashcards();
      commit('setFlashcards', response.data);
    } catch (error) {
      console.error('Failed to fetch flashcards', error);
      throw error;
    }
  },
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
};

const mutations = {
  setFlashcards(state, flashcards) {
    state.flashcards = flashcards;
  },
  setCurrentFlashcard(state, flashcard) {
    state.currentFlashcard = flashcard;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
