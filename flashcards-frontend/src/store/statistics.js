import statisticsService from '@/services/api/statistics';

export default {
  namespaced: true,
  state: () => ({
    stats: null,
    progress: null,
    recentActivity: [],
    isLoading: false,
  }),
  actions: {
    async fetchStats({ commit }) {
      try {
        commit('setLoading', true);
        const response = await statisticsService.getUserStats();
        commit('setStats', response.data);
        return response;
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchProgress({ commit }) {
      try {
        commit('setLoading', true);
        const response = await statisticsService.getUserProgress();
        commit('setProgress', response.data);
        return response;
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchRecentActivity({ commit }) {
      try {
        commit('setLoading', true);
        const response = await statisticsService.getRecentActivity();
        commit('setRecentActivity', response.data);
        return response;
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setStats(state, stats) {
      state.stats = stats;
    },
    setProgress(state, progress) {
      state.progress = progress;
    },
    setRecentActivity(state, activity) {
      state.recentActivity = activity;
    },
  }
};
