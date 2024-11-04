import { authService } from '../../api/services/authService';

const state = {
  profile: null,
  statistics: null,
};

const getters = {
  profile: (state) => state.profile,
  statistics: (state) => state.statistics,
};

const actions = {
  async fetchProfile({ commit }) {
    try {
      const profile = await authService.fetchUser();
      commit('setProfile', profile);
    } catch (error) {
      console.error('Fetch profile failed:', error);
      throw error;
    }
  },
  async fetchStatistics({ commit }) {
    try {
      const response = await axiosInstance.get('statistics/');
      commit('setStatistics', response.data);
    } catch (error) {
      console.error('Fetch statistics failed:', error);
      throw error;
    }
  },
  async updateProfile({ commit }, profileData) {
    try {
      const response = await axiosInstance.put('profile/', profileData);
      commit('setProfile', response.data);
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },
  async uploadProfilePicture({ commit }, formData) {
    try {
      const response = await axiosInstance.post('upload-profile-picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      commit('setProfile', response.data);
    } catch (error) {
      console.error('Upload profile picture failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
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
