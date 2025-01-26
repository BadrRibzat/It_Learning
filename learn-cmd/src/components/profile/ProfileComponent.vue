<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div
      :class="[
        isSidebarOpen ? 'ml-64' : 'ml-16',
        'flex-1 transition-all duration-300 ease-in-out p-6'
      ]"
    >
    <div class="mt-8">
    <StatisticsChart
      v-if="profile?.statistics"
      :statistics="profile.statistics"
    />
  </div>
    <!-- Statistics Section -->
      <div v-if="profile" class="space-y-6">
        <!-- Profile Header -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="relative group">
                <img
                  :src="profile.profile_picture || '/default-avatar.png'"
                  alt="Profile"
                  class="w-24 h-24 rounded-full object-cover"
                />
                <div
                  @click="triggerFileInput"
                  class="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <i class="fas fa-camera"></i>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleProfilePictureChange"
                />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ profile.user.full_name }}
                </h1>
                <p class="text-gray-600">{{ profile.user.email }}</p>
              </div>
            </div>
            <button
              @click="showDeleteConfirm = true"
              class="text-red-600 hover:text-red-800 transition-colors"
            >
              <i class="fas fa-trash-alt mr-2"></i>
              Delete Account
            </button>
          </div>

          <!-- Profile Form -->
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                v-model="profileData.bio"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <LanguageSwitcher
                v-model="profileData.preferred_language"
                class="mt-1"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {{ updating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              Flashcards Progress
            </h3>
            <div class="text-3xl font-bold text-primary">
              {{ profile.statistics?.flashcard_progress?.length || 0 }}
            </div>
            <p class="text-gray-600">Lessons Completed</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              Level Progress
            </h3>
            <div class="text-3xl font-bold text-primary">
              {{ profile.statistics?.level_progression?.current_level || 'Beginner' }}
            </div>
            <p class="text-gray-600">Current Level</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Quiz Status</h3>
            <div class="text-3xl font-bold text-primary">
              {{ profile.statistics?.quiz_unlocked ? 'Available' : 'Locked' }}
            </div>
            <p class="text-gray-600">Quiz Access</p>
          </div>
        </div>
      </div>

      <!-- Delete Account Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Delete Account</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              @click="deleteAccount"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/common/Sidebar.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { NotificationService } from '@/utils/NotificationService';
import StatisticsChart from '@/components/progress/StatisticsChart.vue';
import ProgressCircle from '@/components/progress/ProgressCircle.vue';

export default {
  name: 'ProfileComponent',
  components: {
    ProgressCircle,
    Sidebar,
    StatisticsChart,
    LanguageSwitcher
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const fileInput = ref(null);
    const isSidebarOpen = ref(true);
    const profile = ref(null);
    const updating = ref(false);
    const deleting = ref(false);
    const showDeleteConfirm = ref(false);

    const profileData = ref({
      bio: '',
      preferred_language: 'en',
      profile_picture: null
    });

    const fetchProfile = async () => {
      try {
        const response = await store.dispatch('profile/fetchProfile');
        profile.value = response;
        profileData.value = {
          bio: response.profile_data.bio || '',
          preferred_language: response.profile_data.preferred_language || 'en',
          profile_picture: response.profile_data.profile_picture
        };
      } catch (error) {
        NotificationService.showError('Failed to load profile');
      }
    };

    const updateProfile = async () => {
      updating.value = true;
      try {
        await store.dispatch('profile/updateProfile', profileData.value);
        NotificationService.showSuccess('Profile updated successfully');
        await fetchProfile();
      } catch (error) {
        NotificationService.showError('Failed to update profile');
      } finally {
        updating.value = false;
      }
    };

    const deleteAccount = async () => {
      deleting.value = true;
      try {
        await store.dispatch('auth/deleteAccount');
        NotificationService.showSuccess('Account deleted successfully');
        router.push({ name: 'login' });
      } catch (error) {
        NotificationService.showError('Failed to delete account');
      } finally {
        deleting.value = false;
        showDeleteConfirm.value = false;
      }
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleProfilePictureChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          // Create form data
          const formData = new FormData();
          formData.append('profile_picture', file);
          
          // Update profile data with new picture
          profileData.value.profile_picture = formData;
          await updateProfile();
        } catch (error) {
          NotificationService.showError('Failed to upload profile picture');
        }
      }
    };

    onMounted(() => {
      fetchProfile();
    });

    return {
      profile,
      profileData,
      isSidebarOpen,
      updating,
      deleting,
      showDeleteConfirm,
      fileInput,
      updateProfile,
      deleteAccount,
      triggerFileInput,
      handleProfilePictureChange
    };
  }
};
</script>
