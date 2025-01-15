import { levelTestsService } from '../../api/services/levelTestsService';

const state = {
  levelTests: [],
  currentLevelTest: null,
};

const getters = {
  levelTests: (state) => state.levelTests,
  currentLevelTest: (state) => state.currentLevelTest,
};

const actions = {
  async fetchLevelTests({ commit }) {
    try {
      const response = await levelTestsService.fetchLevelTests();
      commit('setLevelTests', response);
    } catch (error) {
      console.error('Fetch level tests failed:', error);
      throw error;
    }
  },
  async fetchLevelTest({ commit }, id) {
    try {
      const response = await levelTestsService.fetchLevelTest(id);
      commit('setCurrentLevelTest', response);
    } catch (error) {
      console.error('Fetch level test failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setLevelTests(state, levelTests) {
    state.levelTests = levelTests;
  },
  setCurrentLevelTest(state, levelTest) {
    state.currentLevelTest = levelTest;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
