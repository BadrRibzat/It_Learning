import flashcardsService from '@/services/api/flashcards';

export default {
  namespaced: true,
  state: () => ({
    flashcards: [],
    currentFlashcard: null,
    loading: false,
    error: null,
    flashcardsDetails: null
  }),
  
  mutations: {
    SET_FLASHCARDS(state, flashcards) {
      state.flashcards = flashcards;
    },
    SET_CURRENT_FLASHCARD(state, flashcard) {
      state.currentFlashcard = flashcard;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_FLASHCARDS_DETAILS(state, details) {
      state.flashcardsDetails = details;
    }
  },
  
  actions: {
    async fetchFlashcards({ commit }, params) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await flashcardsService.getFlashcards(params);
        commit('SET_FLASHCARDS', response.data);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch flashcards');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchFlashcard({ commit }, { id, includeDetails = false }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await flashcardsService.getFlashcard(id, includeDetails);
        commit('SET_CURRENT_FLASHCARD', response.data);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch flashcard');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchFlashcardsWithDetails({ commit }, lessonId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const details = await flashcardsService.getFlashcardsWithDetails(lessonId);
        commit('SET_FLASHCARDS_DETAILS', details);
        commit('SET_FLASHCARDS', details.flashcards);
        return details;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch flashcards with details');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async submitAnswer({ commit, dispatch }, { id, answer }) {
      try {
        const response = await flashcardsService.submitFlashcard(id, answer);
        
        // Dispatch notification based on result
        if (response.data.isCorrect) {
          dispatch('app/showNotification', {
            message: 'Correct answer! Great job!',
            type: 'success'
          }, { root: true });
        } else {
          dispatch('app/showNotification', {
            message: 'Incorrect answer. Keep trying!',
            type: 'warning'
          }, { root: true });
        }
        
        return response.data;
      } catch (error) {
        dispatch('app/showNotification', {
          message: 'Error submitting answer',
          type: 'error'
        }, { root: true });
        throw error;
      }
    }
  }
};
