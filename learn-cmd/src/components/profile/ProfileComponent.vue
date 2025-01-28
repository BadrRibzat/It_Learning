<template>
  <div class="flex-1">
    <!-- Loading State -->
    <LoadingSpinner v-if="isLoading" 
                   fullscreen 
                   size="lg" 
                   label="Loading profile..." />

    <!-- Error State -->
    <div v-else-if="error" 
         class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <font-awesome-icon icon="exclamation-triangle" class="h-5 w-5 text-red-500" />
        </div>
        <div class="ml-3">
          <p class="text-red-700">{{ error }}</p>
          <button @click="retryLoading" 
                  class="mt-2 text-red-700 hover:text-red-600 font-medium">
            Try again
          </button>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex justify-between items-center">
          <!-- Profile Picture Section -->
          <div class="flex items-center space-x-4">
            <div class="relative group">
              <div class="relative">
                <div class="w-24 h-24 rounded-full border-4 border-primary overflow-hidden"
                     :class="{ 'opacity-50': isUpdatingPicture }">
                  <template v-if="profileData.profile_picture">
                    <img
                      :src="profileData.profile_picture"
                      alt="Profile picture"
                      class="w-full h-full object-cover"
                    />
                  </template>
                  <div v-else
                       class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <font-awesome-icon icon="user"
                                     class="text-3xl text-gray-400" />
                  </div>
                </div>
                <LoadingSpinner v-if="isUpdatingPicture" 
                               size="sm" 
                               class="absolute inset-0 m-auto" />
              </div>
              <div
                @click="triggerFileInput"
                class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                role="button"
                tabindex="0"
                @keypress.enter="triggerFileInput"
              >
                <font-awesome-icon icon="camera" class="text-xl" />
                <span class="sr-only">Upload profile picture</span>
              </div>
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="handleProfilePictureChange"
                aria-label="Upload profile picture"
              />
            </div>
            
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ userFullName }}</h1>
              <p class="text-gray-600">{{ userEmail }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ userBio }}</p>
            </div>
          </div>

          <!-- Progress Circle -->
          <div class="flex items-center space-x-6">
            <ProgressCircle
              :progress="levelProgress"
              :label="currentLevel"
              :size="100"
              color="#4F46E5"
            />
          </div>
        </div>
      </div>

      <!-- Statistics Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Flashcards Progress"
          :value="`${flashcardStats.completed}/${flashcardStats.total}`"
          label="Cards Completed"
          icon="layer-group"
        />

        <StatCard
          title="Current Level"
          :value="currentLevel"
          label="Learning Progress"
          icon="graduation-cap"
        />

        <StatCard
          title="Quiz Status"
          :value="`${flashcardStats.unlockedQuizzes} Available`"
          label="Next Quiz Available"
          icon="question-circle"
        />
      </div>

      <!-- Tabs Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-4" aria-label="Profile sections">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-md font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-gray-900'
            ]"
            :aria-selected="activeTab === tab.id"
            role="tab"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Dynamic Content -->
      <keep-alive>
        <component 
          :is="activeComponent"
          v-bind="componentProps"
          @update="handleUpdate"
        />
      </keep-alive>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ProgressCircle from '@/components/progress/ProgressCircle.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import StatCard from '@/components/common/StatCard.vue';
import { NotificationService } from '@/utils/NotificationService';

const ProfilePersonal = defineAsyncComponent(() => 
  import('@/components/profile/ProfilePersonal.vue')
);
const ProfilePreferences = defineAsyncComponent(() => 
  import('@/components/profile/ProfilePreferences.vue')
);
const ProfileStatistics = defineAsyncComponent(() => 
  import('@/components/profile/ProfileStatistics.vue')
);

const store = useStore();
const router = useRouter();
const fileInput = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isUpdatingPicture = ref(false);
const activeTab = ref('personal');

const profileData = ref({
  profile_picture: null
});

const tabs = [
  { id: 'personal', name: 'Personal Info' },
  { id: 'preferences', name: 'Preferences' },
  { id: 'statistics', name: 'Statistics' }
];

const profile = computed(() => store.getters['profile/profile']);
const statistics = computed(() => store.getters['profile/statistics']);
const welcomeMessage = computed(() => store.getters['profile/welcomeMessage']);
const userFullName = computed(() => store.getters['profile/userFullName']);
const userEmail = computed(() => store.getters['profile/userEmail']);
const currentLevel = computed(() => store.getters['profile/currentLevel']);
const flashcardStats = computed(() => store.getters['profile/flashcardStats']);
const userBio = computed(() => profile.value?.bio || 'No bio added yet');
const levelProgress = computed(() => {
  const progression = statistics.value?.level_progression;
  return progression ? Math.round((progression.progress || 0) * 100) : 0;
});

const componentProps = computed(() => ({
  profile: profile.value,
  statistics: statistics.value
}));

const activeComponent = computed(() => {
  switch (activeTab.value) {
    case 'personal':
      return 'ProfilePersonal';
    case 'preferences':
      return 'ProfilePreferences';
    case 'statistics':
      return 'ProfileStatistics';
    default:
      return 'ProfilePersonal';
  }
});

const loadProfile = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await store.dispatch('profile/fetchProfile');
  } catch (err) {
    error.value = 'Failed to load profile data. Please try again.';
    NotificationService.showError(error.value);
  } finally {
    isLoading.value = false;
  }
};

const retryLoading = () => {
  loadProfile();
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleProfilePictureChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    NotificationService.showError('Please upload a valid image file (JPEG, PNG, or GIF)');
    return;
  }

  if (file.size > maxSize) {
    NotificationService.showError('Image size should be less than 5MB');
    return;
  }

  isUpdatingPicture.value = true;
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    await store.dispatch('profile/updateProfile', {
      ...profileData.value,
      profile_picture: formData
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      profileData.value.profile_picture = e.target.result;
    };
    reader.readAsDataURL(file);
    
    NotificationService.showSuccess('Profile picture updated successfully');
  } catch (error) {
    NotificationService.showError('Failed to update profile picture');
    profileData.value.profile_picture = null;
  } finally {
    isUpdatingPicture.value = false;
  }
};

const handleUpdate = async (data) => {
  isLoading.value = true;
  try {
    await store.dispatch('profile/updateProfile', data);
    NotificationService.showSuccess('Profile updated successfully');
  } catch (error) {
    NotificationService.showError('Failed to update profile');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-picture-upload:hover .upload-overlay {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.group:hover .opacity-0 {
  opacity: 1;
}

.group:focus-within .opacity-0 {
  opacity: 1;
}
</style>
