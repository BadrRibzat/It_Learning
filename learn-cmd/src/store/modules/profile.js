import ProfileService from '@/services/api/ProfileService';
import { NotificationService } from '@/utils/NotificationService';

const state = {
  profile: {
    username: "",
    email: "",
    bio: "",
    date_of_birth: "",
    language: "en",
    profile_picture: null,
    mfa: {
      is_enabled: false,
      provisioning_uri: null,
    },
  },
  statistics: {
    completed_lessons: 0,
    total_points: 0,
    correct_flashcards: 0,
    total_flashcards: 0,
    learning_streak: 0,
    time_spent_learning: {
      total_hours: 0,
      total_minutes: 0,
    },
    current_level_progress: {
      level_name: "",
      lessons_progress: {
        completed: 0,
        total: 0,
        percentage: 0,
      },
      quizzes_progress: {
        passed: 0,
        total: 0,
        percentage: 0,
      },
    },
  },
};

const getters = {
  profile: (state) => state.profile,
  statistics: (state) => state.statistics,
};

const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_STATISTICS(state, statistics) {
    state.statistics = statistics;
  },
};

const actions = {
  async fetchProfile({ commit }, username) {
    try {
      const profile = await ProfileService.getProfile(username);
      commit('SET_PROFILE', profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      NotificationService.showError('Failed to fetch profile. Please try again.');
    }
  },

  async updateProfile({ commit }, { username, data }) {
    try {
      const updatedProfile = await ProfileService.updateProfile(username, data);
      commit('SET_PROFILE', updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      NotificationService.showError('Failed to update profile. Please try again.');
    }
  },

  async uploadProfilePicture({ dispatch }, file) {
    try {
      await ProfileService.uploadProfilePicture(file);
      dispatch('fetchProfile', state.profile.username);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      NotificationService.showError('Failed to upload profile picture. Please try again.');
    }
  },

  async deleteProfilePicture({ dispatch }) {
    try {
      await ProfileService.deleteProfilePicture();
      dispatch('fetchProfile', state.profile.username);
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      NotificationService.showError('Failed to delete profile picture. Please try again.');
    }
  },

  async fetchStatistics({ commit }, username) {
    try {
      const statistics = await ProfileService.getStatistics(username);
      commit('SET_STATISTICS', statistics);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      NotificationService.showError('Failed to fetch statistics. Please try again.');
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
