import { getUserProfile, updateUserProfile, getUserStatistics } from '../../services/profile.services';

const state = {
  userProfile: null,
  userStatistics: null,
};

const getters = {
  userProfile: (state) => state.userProfile,
  userStatistics: (state) => state.userStatistics,
};

const mutations = {
  SET_USER_PROFILE(state, profile) {
    state.userProfile = profile;
  },
  SET_USER_STATISTICS(state, statistics) {
    state.userStatistics = statistics;
  },
};

const actions = {
  async getUserProfile({ commit }) {
    try {
      const response = await getUserProfile();
      commit('SET_USER_PROFILE', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile({ commit }, profileData) {
    try {
      const response = await updateUserProfile(profileData);
      commit('SET_USER_PROFILE', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserStatistics({ commit }) {
    try {
      const response = await getUserStatistics();
      commit('SET_USER_STATISTICS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
