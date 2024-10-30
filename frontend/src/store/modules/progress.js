import { progressService } from '@/api/services/progress';

export default {
  namespaced: true,
  state: {
    userProgress: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_USER_PROGRESS(state, progress) {
      state.userProgress = progress;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchUserProgress({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await progressService.getUserProgress();
        commit('SET_USER_PROGRESS', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user progress');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateUserProgress({ commit }, progressData) {
      try {
        commit('SET_LOADING', true);
        const { data } = await progressService.updateUserProgress(progressData);
        commit('SET_USER_PROGRESS', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update user progress');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    userProgress: (state) => state.userProgress,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
