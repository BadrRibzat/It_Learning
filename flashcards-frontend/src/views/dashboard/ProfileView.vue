<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Profile Information -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-6">Profile Information</h2>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Profile Picture -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="relative">
                <img 
                  :src="profilePictureUrl || '/default-avatar.png'"
                  class="w-24 h-24 rounded-full object-cover"
                  alt="Profile picture"
                />
                <label 
                  class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark"
                >
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/*"
                    @change="handleFileChange"
                  />
                  <font-awesome-icon icon="upload" />
                </label>
              </div>
              <button 
                v-if="profilePictureUrl"
                @click="deleteProfilePicture"
                class="text-red-500 hover:text-red-700"
              >
                Delete Picture
              </button>
            </div>

            <!-- Profile Fields -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  v-model="profileData.username"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  v-model="profileData.email"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Language</label>
                <select 
                  v-model="profileData.language"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                @click="resetProgress"
                class="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
              >
                Reset Progress
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Statistics -->
        <div class="space-y-6">
          <!-- Learning Progress -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Learning Progress</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Current Level</p>
                <p class="text-2xl font-bold text-primary">{{ stats.currentLevel }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Total Points</p>
                <p class="text-2xl font-bold text-primary">{{ stats.totalPoints }}</p>
              </div>
            </div>
          </div>

          <!-- Achievement Stats -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Achievements</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Completed Lessons</p>
                <p class="text-2xl font-bold text-green-600">{{ stats.completedLessons }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Success Rate</p>
                <p class="text-2xl font-bold text-green-600">{{ stats.successRate }}%</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                    <font-awesome-icon :icon="activity.icon" class="text-primary" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const profileData = ref({
  username: '',
  email: '',
  language: 'en'
});
const profilePictureUrl = ref(null);
const stats = ref({
  currentLevel: 1,
  totalPoints: 0,
  completedLessons: 0,
  successRate: 0
});
const recentActivity = ref([]);

const loadProfile = async () => {
  try {
    const response = await store.dispatch('profile/fetchProfile');
    profileData.value = {
      username: response.data.username,
      email: response.data.email,
      language: response.data.language
    };
    profilePictureUrl.value = response.data.profile_picture;
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};

const loadStats = async () => {
  try {
    const response = await store.dispatch('profile/fetchStats');
    stats.value = response.data;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const loadRecentActivity = async () => {
  try {
    const response = await store.dispatch('profile/fetchRecentActivity');
    recentActivity.value = response.data;
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profile_picture', file);
    try {
      await store.dispatch('profile/uploadProfilePicture', formData);
      await loadProfile();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  }
};

const deleteProfilePicture = async () => {
  try {
    await store.dispatch('profile/deleteProfilePicture');
    profilePictureUrl.value = null;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
  }
};

const updateProfile = async () => {
  try {
    await store.dispatch('profile/updateProfile', profileData.value);
    // Show success message
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

const resetProgress = async () => {
  if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
    try {
      await store.dispatch('profile/resetProgress');
      await loadStats();
      // Show success message
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }
};

onMounted(async () => {
  await Promise.all([
    loadProfile(),
    loadStats(),
    loadRecentActivity()
  ]);
});
</script>
