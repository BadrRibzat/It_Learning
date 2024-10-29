<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Profile</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Personal Information</h2>
        <form @submit.prevent="updateProfile">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div class="mb-4">
            <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              v-model="form.bio"
              id="bio"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              @change="handleFileChange"
              accept="image/*"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div v-if="statistics">
        <h2 class="text-2xl font-bold mb-4">Statistics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">Total Lessons Completed</h3>
            <p class="text-gray-600">{{ statistics.lessonsCompleted || 0 }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">Total Points</h3>
            <p class="text-gray-600">{{ statistics.totalPoints || 0 }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">Current Level</h3>
            <p class="text-gray-600">{{ statistics.currentLevel || 1 }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">Learning Streak</h3>
            <p class="text-gray-600">{{ statistics.learningStreak || 0 }} days</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useNotification } from '@/composables/useNotification';

const store = useStore();
const { show } = useNotification();

const form = ref({
  username: '',
  email: '',
  bio: '',
  profilePicture: null,
});

const statistics = ref({});

onMounted(async () => {
  await fetchProfileData();
  await fetchStatistics();
});

const fetchProfileData = async () => {
  try {
    const profileData = await store.dispatch('profile/fetchProfile');
    form.value = { ...profileData };
  } catch (error) {
    show('Failed to load profile data', 'error');
  }
};

const fetchStatistics = async () => {
  try {
    statistics.value = await store.dispatch('profile/fetchStatistics');
  } catch (error) {
    show('Failed to load statistics', 'error');
    statistics.value = {}; // Set to an empty object to prevent undefined errors
  }
};

const handleFileChange = (event) => {
  form.value.profilePicture = event.target.files[0];
};

const updateProfile = async () => {
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach((key) => {
      if (key === 'profilePicture' && form.value[key]) {
        formData.append(key, form.value[key]);
      } else {
        formData.append(key, form.value[key]);
      }
    });
    await store.dispatch('profile/updateProfile', formData);
    show('Profile updated successfully', 'success');
  } catch (error) {
    show('Failed to update profile', 'error');
  }
};
</script>
