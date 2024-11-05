import api from '@/api';

const state = {
  levels: [],
};

const mutations = {
  SET_LEVELS(state, levels) {
    state.levels = levels;
  },
};

const actions = {
  async fetchLevels({ commit }) {
    try {
      const response = await api.get('/levels/');
      commit('SET_LEVELS', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
