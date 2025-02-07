<template>
  <div class="profile-page container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="retryLoading" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>
    
    <!-- Content State -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Profile Header -->
      <div class="lg:col-span-12">
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Welcome back, {{ profile?.profile_data?.full_name || 'User' }}!
              </h1>
              <p class="text-gray-600 mt-1">
                Last active: {{ formatDate(profile?.profile_data?.last_active) }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <router-link 
                to="/profile/achievements" 
                class="text-primary-600 hover:text-primary-700"
              >
                View Achievements
              </router-link>
              <router-link 
                to="/profile/stats" 
                class="text-primary-600 hover:text-primary-700"
              >
                Learning Stats
              </router-link>
              <button
                @click="showSettings = true"
                class="text-gray-600 hover:text-gray-800"
              >
                <cog-icon class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Left Column -->
      <div class="lg:col-span-4 space-y-8">
        <!-- Profile Info -->
        <ProfileInfo 
          :profile="profile?.profile_data"
          :loading="updating"
          @update="handleProfileUpdate"
          @upload-picture="handlePictureUpload"
          @delete-account="handleDeleteAccount"
        />

        <!-- Level & Progress -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Current Level</h2>
          <div class="space-y-4">
            <ProgressCircle
              title="Overall Progress"
              :progress="profile?.current_level?.overall_progress || 0"
              :color="profile?.current_level?.animations?.circle_color"
            />
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Points to next level: {{ pointsToNextLevel }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Quick Stats</h2>
          <div class="space-y-4">
            <QuickStat
              label="Total Points"
              :value="profile?.learning_stats?.total_points || 0"
              icon="TrophyIcon"
            />
            <QuickStat
              label="Current Streak"
              :value="profile?.learning_stats?.streak?.current_streak || 0"
              icon="FireIcon"
              suffix="days"
            />
            <QuickStat
              label="Achievements"
              :value="(profile?.learning_stats?.achievements || []).length"
              icon="StarIcon"
            />
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Progress Overview -->
        <LearningProgress 
          :stats="profile?.learning_stats"
          :current-level="profile?.current_level"
          :loading="loading"
        />
        
        <!-- Learning Statistics -->
        <LearningStatistics 
          :stats="profile?.learning_stats"
          :loading="loading"
        />
        
        <!-- Recent Activities -->
        <ActivityFeed 
          :activities="profile?.recent_activities"
          :loading="loading"
          :has-more="hasMoreActivities"
          @load-more="loadMoreActivities"
        />

        <!-- Recent Achievements -->
        <div v-if="profile?.learning_stats?.achievements?.length" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Recent Achievements</h2>
            <router-link 
              to="/profile/achievements"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </router-link>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Achievement
              v-for="achievement in recentAchievements"
              :key="achievement.id"
              :achievement="achievement"
            />
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      <ProfileSettingsModal
        v-if="showSettings"
        :profile="profile?.profile_data"
        :learning-stats="profile?.learning_stats"
        @close="showSettings = false"
        @update="handleSettingsUpdate"
      />

      <!-- Debug Component -->
      <div v-if="isDevelopment" class="lg:col-span-12">
        <DebugComponent :data="debugData" />
      </div>
    </div>

    <!-- Celebration Modal -->
    <TransitionRoot appear :show="showCelebration" as="template">
      <Dialog as="div" @close="closeCelebration" class="relative z-50">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  🎉 Achievement Unlocked!
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Congratulations! You've reached a new milestone.
                  </p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { CogIcon, TrophyIcon, FireIcon, StarIcon } from '@heroicons/vue/24/outline';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import type { 
  ProfileResponse, 
  ProfileUpdate,
  ProfileDebugData,
  Achievement as AchievementType
} from '@/types/profile';

// Component imports
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ProfileInfo from '@/components/profile/ProfileInfo.vue';
import LearningProgress from '@/components/profile/LearningProgress.vue';
import LearningStatistics from '@/components/profile/LearningStatistics.vue';
import ActivityFeed from '@/components/profile/ActivityFeed.vue';
import Achievement from '@/components/achievements/Achievement.vue';
import ProgressCircle from '@/components/profile/ProgressCircle.vue';
import QuickStat from '@/components/profile/QuickStat.vue';
import ProfileSettingsModal from '@/components/profile/ProfileSettingsModal.vue';
import DebugComponent from '@/components/common/DebugComponent.vue';

// Store and router setup
const router = useRouter();
const toast = useToast();
const profileStore = useProfileStore();
const authStore = useAuthStore();

// State
const loading = ref(true);
const updating = ref(false);
const error = ref<string | null>(null);
const profile = ref<ProfileResponse | null>(null);
const activitiesPage = ref(1);
const showSettings = ref(false);
const showCelebration = ref(false);

// Computed properties
const isDevelopment = computed(() => import.meta.env.MODE === 'development');

const debugData = computed<ProfileDebugData>(() => ({
  profile: profile.value,
  loading: loading.value,
  error: error.value,
  updating: updating.value
}));

const hasMoreActivities = computed(() => {
  if (!profile.value?.recent_activities) return false;
  return profile.value.recent_activities.length >= 20 * activitiesPage.value;
});

const pointsToNextLevel = computed(() => {
  if (!profile.value?.learning_stats?.total_points) return 0;
  const currentPoints = profile.value.learning_stats.total_points;
  const nextLevelPoints = Math.ceil(currentPoints / 1000) * 1000;
  return nextLevelPoints - currentPoints;
});

const recentAchievements = computed(() => {
  return profile.value?.learning_stats?.achievements?.slice(0, 4) || [];
});

// Methods
const formatDate = (date: string | Date | undefined, showTime = false) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

const loadProfile = async () => {
  try {
    loading.value = true;
    error.value = null;
    await profileStore.fetchProfile();
    profile.value = profileStore.profile;

    // Check for celebrations
    if (profile.value?.current_level?.animations?.celebration) {
      showCelebration.value = true;
    }
  } catch (err) {
    error.value = 'Failed to load profile data';
    toast.error('Failed to load profile data');
  } finally {
    loading.value = false;
  }
};

const handleProfileUpdate = async (data: ProfileUpdate) => {
  try {
    updating.value = true;
    await profileStore.updateProfile(data);
    profile.value = profileStore.profile;
    toast.success('Profile updated successfully');
  } catch (err) {
    toast.error('Failed to update profile');
  } finally {
    updating.value = false;
  }
};

const handlePictureUpload = async (file: File) => {
  try {
    updating.value = true;
    await profileStore.uploadProfilePicture(file);
    profile.value = profileStore.profile;
    toast.success('Profile picture updated successfully');
  } catch (err) {
    toast.error('Failed to upload profile picture');
  } finally {
    updating.value = false;
  }
};

const handleSettingsUpdate = async (settings: ProfileSettings) => {
  try {
    updating.value = true;
    await profileStore.updateSettings(settings);
    profile.value = profileStore.profile;
    showSettings.value = false;
    toast.success('Settings updated successfully');
  } catch (err) {
    toast.error('Failed to update settings');
  } finally {
    updating.value = false;
  }
};

const handleDeleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }

  try {
    updating.value = true;
    await profileStore.deleteAccount();
    await authStore.logout();
    router.push('/');
    toast.success('Account deleted successfully');
  } catch (err) {
    toast.error('Failed to delete account');
  } finally {
    updating.value = false;
  }
};

const loadMoreActivities = async () => {
  try {
    activitiesPage.value++;
    await profileStore.fetchActivityFeed(20, (activitiesPage.value - 1) * 20);
    if (profileStore.profile) {
      profile.value = profileStore.profile;
    }
  } catch (err) {
    toast.error('Failed to load more activities');
    activitiesPage.value--;
  }
};

const retryLoading = () => {
  loadProfile();
};

const closeCelebration = () => {
  showCelebration.value = false;
};

// Lifecycle hooks
onMounted(() => {
  loadProfile();
});

// Watch for profile changes
watch(() => profile.value?.current_level?.animations?.celebration, (newValue) => {
  if (newValue) {
    showCelebration.value = true;
  }
});
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px); /* Adjust based on your header height */
}

.celebration-modal {
  @apply fixed inset-0 z-50 overflow-y-auto;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-25;
}

.modal-content {
  @apply relative bg-white rounded-lg mx-auto mt-10 max-w-md p-6;
}
</style>
