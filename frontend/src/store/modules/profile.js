import { profileService } from '@/api/services/profile';

export default {
  namespaced: true,
  state: {
    profile: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true);
      try {
        const { data } = await profileService.getProfile();
        commit('SET_PROFILE', data);
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch profile');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchStatistics({ commit }) {
      commit('SET_LOADING', true);
      try {
        const { data } = await profileService.getStatistics();
        commit('SET_STATISTICS', data);
        return data;
      } catch (error) {
        console.error('Error fetching statistics:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch statistics');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateProfile({ commit }, profileData) {
      commit('SET_LOADING', true);
      try {
        const { data } = await profileService.updateProfile(profileData);
        commit('SET_PROFILE', data);
        return data;
      } catch (error) {
        console.error('Error updating profile:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update profile');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    userProfile: (state) => state.profile,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
