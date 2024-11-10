import profileService from '@/services/api/profile';

export default {
    namespaced: true,
    state: () => ({
        profile: null,
        stats: null,
        recentActivity: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchProfile({ commit }) {
            commit('setLoading', true);
            commit('setError', null);
            try {
                const response = await profileService.getProfile();
                commit('setProfile', response.data);
                return response;
            } catch (error) {
                const errorMessage = error.response?.data?.detail || 'Failed to fetch profile';
                commit('setError', errorMessage);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchStats({ commit }) {
            commit('setLoading', true);
            try {
                const response = await profileService.getStats();
                commit('setStats', response.data);
                return response;
            } catch (error) {
                commit('setError', 'Failed to fetch stats');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchRecentActivity({ commit }) {
            commit('setLoading', true);
            try {
                const response = await profileService.getRecentActivity();
                commit('setRecentActivity', response.data);
                return response;
            } catch (error) {
                commit('setError', 'Failed to fetch recent activity');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async updateProfile({ commit }, profileData) {
            commit('setLoading', true);
            try {
                const response = await profileService.updateProfile(profileData);
                commit('setProfile', response.data);
                return response;
            } catch (error) {
                commit('setError', 'Failed to update profile');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async uploadProfilePicture({ commit }, formData) {
            commit('setLoading', true);
            try {
                const response = await profileService.uploadProfilePicture(formData);
                await this.dispatch('profile/fetchProfile');
                return response;
            } catch (error) {
                commit('setError', 'Failed to upload profile picture');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async deleteProfilePicture({ commit }) {
            commit('setLoading', true);
            try {
                const response = await profileService.deleteProfilePicture();
                await this.dispatch('profile/fetchProfile');
                return response;
            } catch (error) {
                commit('setError', 'Failed to delete profile picture');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async resetProgress({ commit }) {
            commit('setLoading', true);
            try {
                const response = await profileService.resetProgress();
                await Promise.all([
                    this.dispatch('profile/fetchProfile'),
                    this.dispatch('profile/fetchStats')
                ]);
                return response;
            } catch (error) {
                commit('setError', 'Failed to reset progress');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        }
    },
    mutations: {
        setProfile(state, profile) {
            state.profile = profile;
        },
        setStats(state, stats) {
            state.stats = stats;
        },
        setRecentActivity(state, activity) {
            state.recentActivity = activity;
        },
        setLoading(state, loading) {
            state.loading = loading;
        },
        setError(state, error) {
            state.error = error;
        }
    }
};
