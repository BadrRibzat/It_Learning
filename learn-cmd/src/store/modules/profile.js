import ProfileService from '@/services/api/ProfileService';
import { NotificationService } from '@/utils/NotificationService';

export default {
  namespaced: true,

  state: {
    welcomeMessage: '',
    profile: null,
    statistics: null,
    loading: false,
    error: null
  },

  mutations: {
    SET_WELCOME_MESSAGE(state, message) {
      state.welcomeMessage = message;
    },
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
    },
    CLEAR_PROFILE(state) {
      state.welcomeMessage = '';
      state.profile = null;
      state.statistics = null;
    }
  },

  actions: {
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProfileService.getProfile();
        commit('SET_WELCOME_MESSAGE', response.message);
        commit('SET_PROFILE', response.profile_data);
        commit('SET_STATISTICS', response.statistics);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch profile');
        return {
          message: 'Welcome!',
          profile_data: {
            bio: '',
            preferred_language: 'en',
            profile_picture: null,
            user: {
              full_name: 'User',
              email: ''
            }
          },
          statistics: {
            flashcard_progress: [],
            level_progression: { 
              current_level: 'Beginner',
              next_level: null,
              required_score: 0.8,
              unlocked_levels: []
            }
          }
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateProfile({ commit, dispatch }, profileData) {
      commit('SET_LOADING', true);
      try {
        const response = await ProfileService.updateProfile(profileData);
        NotificationService.showSuccess('Profile updated successfully');
        await dispatch('fetchProfile');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to update profile');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteAccount({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await ProfileService.deleteAccount();
        commit('CLEAR_PROFILE');
        NotificationService.showSuccess('Account deleted successfully');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        NotificationService.showError('Failed to delete account');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    welcomeMessage: state => state.welcomeMessage,
    profile: state => state.profile,
    statistics: state => state.statistics,
    isLoading: state => state.loading,
    error: state => state.error,
    userFullName: state => state.profile?.user?.full_name || 'User',
    userEmail: state => state.profile?.user?.email || '',
    currentLevel: state => state.statistics?.level_progression?.current_level || 'Beginner',
    flashcardProgress: state => state.statistics?.flashcard_progress || [],
    levelProgression: state => state.statistics?.level_progression || {
      current_level: 'Beginner',
      next_level: null,
      required_score: 0.8,
      unlocked_levels: []
    },
    flashcardStats: state => {
      const progress = state.statistics?.flashcard_progress || [];
      return {
        completed: progress.reduce((sum, lesson) => sum + lesson.completed_flashcards, 0),
        total: progress.reduce((sum, lesson) => sum + lesson.total_flashcards, 0),
        unlockedQuizzes: progress.filter(lesson => lesson.quiz_unlocked).length
      };
    }
  }
};
