<template>
  <div class="profile-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="retryLoading" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>
    
    <div v-else>
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="relative group">
              <div class="profile-picture-container">
                <Avatar
                  :src="profile?.profile_data?.profile_picture"
                  :name="profile?.profile_data?.full_name || 'User'"
                  size="xl"
                  class="mb-4"
                />
                <div class="profile-picture-overlay">
                  <label class="cursor-pointer w-full h-full flex items-center justify-center">
                    <span class="text-white text-sm">
                      {{ updating ? 'Uploading...' : 'Change Picture' }}
                    </span>
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handlePictureUpload"
                      :disabled="updating"
                    />
                  </label>
                </div>
              </div>
              <p v-if="pictureError" class="mt-2 text-sm text-red-600 text-center">
                {{ pictureError }}
              </p>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Welcome back, {{ profile?.profile_data?.full_name || 'User' }}!
              </h1>
              <p class="text-gray-600 mt-1">
                Last active: {{ formatDate(profile?.profile_data?.last_active) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/profile/learning" 
              class="text-primary-600 hover:text-primary-700"
            >
              Start Learning
            </router-link>
            <router-link 
              to="/profile/achievements" 
              class="text-primary-600 hover:text-primary-700"
            >
              Achievements
            </router-link>
            <router-link 
              to="/profile/stats" 
              class="text-primary-600 hover:text-primary-700"
            >
              Stats
            </router-link>
            <button
              @click="showSettings = true"
              class="text-gray-600 hover:text-gray-800"
            >
              <CogIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <router-link
        to="/profile/settings"
        class="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
      >
        <CogIcon class="h-5 w-5" />
        <span>Settings</span>
      </router-link>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-8">
          <ProfileInfo 
            :profile="profile?.profile_data"
            :loading="updating"
            @update="handleProfileUpdate"
            @delete-account="handleDeleteAccount"
          />
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
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Quick Stats</h2>
            <div class="space-y-4">
              <QuickStat
                title="Total Points"
                label="Total Points"
                :value="profile?.learning_stats?.total_points || 0"
                icon="TrophyIcon"
              />
              <QuickStat
                title="Current Streak"
                label="Current Streak"
                :value="profile?.learning_stats?.streak?.current_streak || 0"
                icon="FireIcon"
                suffix="days"
              />
              <QuickStat
                title="Achievements"
                label="Achievements"
                :value="(profile?.learning_stats?.achievements || []).length"
                icon="StarIcon"
              />
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <router-view></router-view>
        </div>
      </div>

      <ProfileSettingsModal
        v-if="showSettings"
        :profile="profile?.profile_data"
        :learning-stats="profile?.learning_stats"
        @close="showSettings = false"
        @update="handleSettingsUpdate"
      />

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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, provide } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { CogIcon, TrophyIcon, FireIcon, StarIcon } from '@heroicons/vue/24/outline';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import type { 
  ProfileResponse, 
  ProfileUpdate,
  ProfileSettings
} from '@/types/profile';

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ProfileInfo from '@/components/profile/ProfileInfo.vue';
import ProgressCircle from '@/components/profile/ProgressCircle.vue';
import QuickStat from '@/components/profile/QuickStat.vue';
import ProfileSettingsModal from '@/components/profile/ProfileSettingsModal.vue';
import Avatar from '@/components/common/Avatar.vue';

const router = useRouter();
const toast = useToast();
const profileStore = useProfileStore();
const authStore = useAuthStore();

const loading = ref(true);
const updating = ref(false);
const error = ref<string | null>(null);
const profile = ref<ProfileResponse | null>(null);
const showSettings = ref(false);
const showCelebration = ref(false);
const pictureError = ref<string | null>(null);

provide('profile', profile.value);

const pointsToNextLevel = computed(() => {
  if (!profile.value?.learning_stats?.total_points) return 0;
  const currentPoints = profile.value.learning_stats.total_points;
  const nextLevelPoints = Math.ceil(currentPoints / 1000) * 1000;
  return nextLevelPoints - currentPoints;
});

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

const handlePictureUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  pictureError.value = null;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    pictureError.value = 'Please upload a valid image file (JPEG, PNG, or GIF)';
    input.value = '';
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    pictureError.value = 'File size must be less than 5MB';
    input.value = '';
    return;
  }

  try {
    updating.value = true;
    const response = await profileStore.uploadProfilePicture(file);
    profile.value = await profileStore.fetchProfile();
    toast.success('Profile picture updated successfully');
  } catch (err) {
    pictureError.value = err instanceof Error ? err.message : 'Failed to upload profile picture';
    toast.error('Failed to upload profile picture');
  } finally {
    updating.value = false;
    input.value = '';
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

const retryLoading = () => {
  loadProfile();
};

const closeCelebration = () => {
  showCelebration.value = false;
};

onMounted(() => {
  loadProfile();
});

// Add watcher to refresh data
watch(() => profileStore.profile, (newProfile) => {
  profile.value = newProfile;
});

watch(() => profile.value?.current_level?.animations?.celebration, (newValue) => {
  if (newValue) {
    showCelebration.value = true;
  }
});
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
}

.profile-picture-container {
  position: relative;
  width: 128px;
  height: 128px;
  margin: 0 auto;
}

.profile-picture-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.75rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.profile-picture-container:hover .profile-picture-overlay {
  opacity: 1;
}
</style>
