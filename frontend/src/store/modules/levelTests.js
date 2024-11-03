import axiosInstance from '../../api/axios';

const state = {
  levelTests: [],
};

const getters = {
  levelTests: (state) => state.levelTests,
};

const actions = {
  async fetchLevelTests({ commit }) {
    const response = await axiosInstance.get('level-tests/');
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
