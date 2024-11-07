import createBaseStore from './base';
import levelsService from '@/services/api/levels';

const initialState = {
  levels: [],
  currentLevel: null,
  levelTestQuestions: [],
};

const { state, setState } = createBaseStore(initialState);

const actions = {
  async fetchLevels({ commit }) {
    try {
      const response = await levelsService.getLevels();
      commit('setLevels', response.data);
    } catch (error) {
      console.error('Failed to fetch levels', error);
      throw error;
    }
  },
  async fetchLevel({ commit }, id) {
    try {
      const response = await levelsService.getLevel(id);
      commit('setCurrentLevel', response.data);
    } catch (error) {
      console.error('Failed to fetch level', error);
      throw error;
    }
  },
  async fetchLevelTestQuestions({ commit }, id) {
    try {
      const response = await levelsService.getLevelTestQuestions(id);
      commit('setLevelTestQuestions', response.data);
    } catch (error) {
      console.error('Failed to fetch level test questions', error);
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
  setLevelTestQuestions(state, questions) {
    state.levelTestQuestions = questions;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
