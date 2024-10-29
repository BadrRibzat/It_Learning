import { profileService } from '@/api/services/profile';

export default {
  namespaced: true,
  state: {
    profile: null,
    statistics: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_STATISTICS(state, statistics) {
      state.statistics = statistics;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    UPDATE_PROFILE_PICTURE(state, pictureUrl) {
      if (state.profile) {
        state.profile.profilePicture = pictureUrl;
      }
    },
  },
  actions: {
    async fetchProfile({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await profileService.getProfile();
        commit('SET_PROFILE', data);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch profile');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateProfile({ commit }, profileData) {
      try {
        commit('SET_LOADING', true);
        const { data } = await profileService.updateProfile(profileData);
        commit('SET_PROFILE', data);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update profile');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async uploadProfilePicture({ commit }, formData) {
      try {
        commit('SET_LOADING', true);
        const { data } = await profileService.uploadProfilePicture(formData);
        commit('UPDATE_PROFILE_PICTURE', data.pictureUrl);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to upload picture');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchStatistics({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await profileService.getStatistics();
        commit('SET_STATISTICS', data);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch statistics');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchUserProgress({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await profileService.getUserProgress();
        return data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async resetProgress({ commit }) {
      try {
        commit('SET_LOADING', true);
        await profileService.resetProgress();
        commit('SET_STATISTICS', null);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to reset progress');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    userProfile: (state) => state.profile,
    userStatistics: (state) => state.statistics,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
