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
      const tests = await levelTestsService.fetchLevelTests();
      commit('setLevelTests', tests);
    } catch (error) {
      console.error('Fetch level tests failed:', error);
      throw error;
    }
  },
  async fetchLevelTest({ commit }, id) {
    try {
      const test = await levelTestsService.fetchLevelTest(id);
      commit('setCurrentLevelTest', test);
    } catch (error) {
      console.error('Fetch level test failed:', error);
      throw error;
    }
  },
  async submitLevelTest({ commit }, { id, answers }) {
    try {
      const result = await levelTestsService.submitLevelTest(id, answers);
      // You might want to handle the result here, e.g., update user level
      return result;
    } catch (error) {
      console.error('Submit level test failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setLevelTests(state, tests) {
    state.levelTests = tests;
  },
  setCurrentLevelTest(state, test) {
    state.currentLevelTest = test;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
