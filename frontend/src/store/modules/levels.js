import { levelsService } from '../../api/services/levelsService';

const state = {
  levels: [],
  currentLevel: null,
};

const getters = {
  levels: (state) => state.levels,
  currentLevel: (state) => state.currentLevel,
};

const actions = {
  async fetchLevels({ commit }) {
    try {
      const response = await levelsService.fetchLevels();
      commit('setLevels', response);
    } catch (error) {
      console.error('Fetch levels failed:', error);
      throw error;
    }
  },
  async fetchLevel({ commit }, id) {
    try {
      const response = await levelsService.fetchLevel(id);
      commit('setCurrentLevel', response);
    } catch (error) {
      console.error('Fetch level failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setLevels(state, levels) {
    state.levels = levels;
  },
  setCurrentLevel(state, level) {
    state.currentLevel = level;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
