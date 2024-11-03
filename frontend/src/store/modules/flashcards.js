import axios from 'axios';

const state = {
  flashcards: [],
};

const getters = {
  flashcards: (state) => state.flashcards,
};

const actions = {
  async fetchFlashcards({ commit }) {
    const response = await axios.get('/api/flashcards/');
    commit('setFlashcards', response.data);
  },
};

const mutations = {
  setFlashcards(state, flashcards) {
    state.flashcards = flashcards;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
