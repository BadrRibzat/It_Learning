import createBaseStore from './base';
import profileService from '@/services/api/profile';

const initialState = {
  profile: null,
};

const { state, setState } = createBaseStore(initialState);

const actions = {
  async fetchProfile({ commit }) {
    try {
      const response = await profileService.getProfile();
      commit('setProfile', response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      throw error;
    }
  },
  async updateProfile({ commit }, profileData) {
    try {
      const response = await profileService.updateProfile(profileData);
      commit('setProfile', response.data);
    } catch (error) {
      console.error('Failed to update profile', error);
      throw error;
    }
  },
  async uploadProfilePicture({ commit }, formData) {
    try {
      const response = await profileService.uploadProfilePicture(formData);
      return response;
    } catch (error) {
      console.error('Failed to upload profile picture', error);
      throw error;
    }
  },
  async resetProgress({ commit }) {
    try {
      const response = await profileService.resetProgress();
      return response;
    } catch (error) {
      console.error('Failed to reset progress', error);
      throw error;
    }
  },
};

const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
