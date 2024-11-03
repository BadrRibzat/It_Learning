import axios from 'axios';

const state = {
  levelTests: [],
};

const getters = {
  levelTests: (state) => state.levelTests,
};

const actions = {
  async fetchLevelTests({ commit }) {
    const response = await axios.get('/api/level-tests/');
    commit('setLevelTests', response.data);
  },
};

const mutations = {
  setLevelTests(state, levelTests) {
    state.levelTests = levelTests;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
