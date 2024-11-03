import axios from 'axios';

const state = {
  profile: null,
  progress: null,
  statistics: null,
};

const getters = {
  profile: (state) => state.profile,
  progress: (state) => state.progress,
  statistics: (state) => state.statistics,
};

const actions = {
  async fetchProfile({ commit }) {
    const response = await axios.get('/api/profile/');
    commit('setProfile', response.data);
  },
  async fetchProgress({ commit }) {
    const response = await axios.get('/api/user-progress/');
    commit('setProgress', response.data);
  },
  async fetchStatistics({ commit }) {
    const response = await axios.get('/api/statistics/');
    commit('setStatistics', response.data);
  },
};

const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
  },
  setProgress(state, progress) {
    state.progress = progress;
  },
  setStatistics(state, statistics) {
    state.statistics = statistics;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
