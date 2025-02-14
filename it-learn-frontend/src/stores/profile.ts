import { defineStore } from 'pinia';
import ProfileService from '@/services/profile.service';
import type {
  ProfileResponse,
  ProfileUpdate,
  LearningStats,
  PointsResponse,
  ProgressCircle,
  ActivityFeed,
  Achievement,
  ProfileSettings,
  NotificationPreferences,
  PrivacySettings
} from '@/types/profile';

interface ProfileState {
  profile: ProfileResponse | null;
  profilePicture: {
    data: string | null;
    timestamp: number;
  };
  statistics: LearningStats | null;
  points: PointsResponse | null;
  progressCircle: ProgressCircle | null;
  activityFeed: ActivityFeed | null;
  achievements: Achievement[];
  settings: {
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
  };
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    profilePicture: {
      data: null,
      timestamp: 0
    },
    statistics: null,
    points: null,
    progressCircle: null,
    activityFeed: null,
    achievements: [],
    settings: {
      notifications: {
        achievements: true,
        progress: true,
        streaks: true
      },
      privacy: {
        public_profile: true,
        show_achievements: true,
        show_activity: true
      }
    },
    loading: false,
    error: null,
    lastUpdate: null
  }),

  getters: {
    isLoading: (state: ProfileState) => state.loading,
    hasError: (state: ProfileState) => state.error !== null,
    profileData: (state: ProfileState) => state.profile?.profile_data ?? null,
    profilePictureUrl: (state: ProfileState) => {
      if (state.profile?.profile_data?.profile_picture) {
        return `data:image/png;base64,${state.profile.profile_data.profile_picture}`;
      }
      return null;
    },
    learningStats: (state: ProfileState) => state.profile?.learning_stats ?? null,
    unlockedAchievements: (state: ProfileState) => 
      state.achievements.filter(a => a.earned_at !== null).map(a => a.id),
    currentStreak: (state: ProfileState) => 
      state.statistics?.streak?.current_streak ?? 0,
    completionRate: (state: ProfileState) => {
      if (!state.achievements.length) return 0;
      const unlocked = state.achievements.filter(a => a.earned_at !== null).length;
      return Math.round((unlocked / state.achievements.length) * 100);
    },
    recentActivities: (state: ProfileState) => 
      state.activityFeed?.activities ?? [],
    hasMoreActivities: (state: ProfileState) => 
      state.activityFeed?.summary?.has_more ?? false,
    userSettings: (state: ProfileState) => state.settings,
  },

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        this.profile = await ProfileService.getProfile();
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      this.loading = true;
      this.error = null;
      try {
        this.statistics = await ProfileService.getStatistics();
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load statistics';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data: ProfileUpdate) {
      try {
        this.loading = true;
        this.error = null;
        const response = await ProfileService.updateProfile(data);
        this.profile = response;
        return response;
      } catch (error: unknown) {
        this.error = 'Failed to update profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadProfilePicture(file: File) {
      try {
        this.loading = true;
        this.error = null;
        const response = await ProfileService.uploadProfilePicture(file);
        this.profilePicture = {
          data: response.profile_picture,
          timestamp: Date.now()
        };
        return response;
      } catch (error: unknown) {
        this.error = 'Failed to upload profile picture';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPoints() {
      this.loading = true;
      this.error = null;
      try {
        this.points = await ProfileService.getPoints();
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load points';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePoints(points: number) {
      if (this.profile?.learning_stats) {
        this.profile.learning_stats.total_points += points;
      }
      await this.fetchProfile();
    },

    async fetchProgressCircle() {
      this.loading = true;
      this.error = null;
      try {
        this.progressCircle = await ProfileService.getProgressCircle();
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load progress data';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchActivityFeed(limit: number = 20, offset: number = 0) {
      this.loading = true;
      this.error = null;
      try {
        this.activityFeed = await ProfileService.getActivityFeed(limit, offset);
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load activity feed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAccount() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ProfileService.deleteAccount();
        // Clear all store data
        this.profile = null;
        this.statistics = null;
        this.points = null;
        this.progressCircle = null;
        this.activityFeed = null;
        return response;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to delete account';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAchievements() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ProfileService.getAchievements();
        this.achievements = response;
        return response;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to load achievements';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSettings(settings: ProfileSettings) {
      try {
        this.loading = true;
        this.error = null;
        const response = await ProfileService.updateSettings(settings);
        if (this.profile) {
          this.profile.settings = response.settings;
        }
        return response;
      } catch (error: unknown) {
        this.error = 'Failed to update settings';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSettings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ProfileService.getSettings();
        if (this.profile) {
          this.profile.settings = response.settings;
        }
        return response;
      } catch (error: unknown) {
        this.error = 'Failed to fetch settings';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadInitialData() {
      this.loading = true;
      this.error = null;
      try {
        const [profile, stats, achievements] = await Promise.all([
          this.fetchProfile(),
          this.fetchStatistics(),
          this.fetchAchievements()
        ]);
        this.lastUpdate = new Date().toISOString();
        return { profile, stats, achievements };
      } catch (error: unknown) {
        this.error = 'Failed to load profile data';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async handleAchievementUnlock(achievementId: string) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.earned_at) {
        achievement.earned_at = new Date();
        // Update statistics if needed
        await this.fetchStatistics();
      }
    },

    async trackActivity(activityType: string, data: Record<string, unknown>) {
      try {
        await ProfileService.trackActivity(activityType, data);
        await this.fetchActivityFeed();
      } catch (error: unknown) {
        console.error('Failed to track activity:', error);
      }
    },

    resetState() {
      this.profile = null;
      this.statistics = null;
      this.points = null;
      this.progressCircle = null;
      this.activityFeed = null;
      this.achievements = [];
      this.settings = {
        notifications: {
          achievements: true,
          progress: true,
          streaks: true
        },
        privacy: {
          public_profile: true,
          show_achievements: true,
          show_activity: true
        }
      };
      this.loading = false;
      this.error = null;
      this.lastUpdate = null;
    },
  },
});
