import ProfileService from '@/services/api/ProfileService';

export default {
  namespaced: true,

  state: {
    profile: null,
    statistics: null,
    loading: false,
    error: null
  },

  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_STATISTICS(state, statistics) {
      state.statistics = statistics;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProfileService.getProfile();
        commit('SET_PROFILE', response.profile_data);
        commit('SET_STATISTICS', response.statistics);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateProfile({ commit }, profileData) {
      commit('SET_LOADING', true);
      try {
        const response = await ProfileService.updateProfile(profileData);
        await dispatch('fetchProfile');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    profile: state => state.profile,
    statistics: state => state.statistics,
    isLoading: state => state.loading,
    error: state => state.error
  }
};
