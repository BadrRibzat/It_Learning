import { levelsService } from '../../api/services/levelsService';

const state = {
  levels: [],
  currentLevel: null,
  userLevelProgress: [],
};

const getters = {
  levels: (state) => state.levels,
  currentLevel: (state) => state.currentLevel,
  userLevelProgress: (state) => state.userLevelProgress,
};

const actions = {
  async fetchLevels({ commit }) {
    try {
      const levels = await levelsService.fetchLevels();
      commit('setLevels', levels);
    } catch (error) {
      console.error('Fetch levels failed:', error);
      throw error;
    }
  },
  async fetchLevel({ commit }, id) {
    try {
      const level = await levelsService.fetchLevel(id);
      commit('setCurrentLevel', level);
    } catch (error) {
      console.error('Fetch level failed:', error);
      throw error;
    }
  },
  async fetchUserLevelProgress({ commit }) {
    try {
      const progress = await levelsService.fetchUserLevelProgress();
      commit('setUserLevelProgress', progress);
    } catch (error) {
      console.error('Fetch user level progress failed:', error);
      throw error;
    }
  },
  async updateUserLevelProgress({ commit }, { levelId, progress }) {
    try {
      const updatedProgress = await levelsService.updateUserLevelProgress(levelId, progress);
      commit('updateUserLevelProgress', updatedProgress);
    } catch (error) {
      console.error('Update user level progress failed:', error);
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
  setUserLevelProgress(state, progress) {
    state.userLevelProgress = progress;
  },
  updateUserLevelProgress(state, updatedProgress) {
    const index = state.userLevelProgress.findIndex(p => p.level === updatedProgress.level);
    if (index !== -1) {
      state.userLevelProgress.splice(index, 1, updatedProgress);
    } else {
      state.userLevelProgress.push(updatedProgress);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
