<template>
  <div class="profile-settings">
    <h2 class="text-2xl font-semibold mb-4">Profile Settings</h2>
    <form @submit.prevent="updateProfile">
      <div class="mb-4">
        <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="full_name"
          v-model="profileUpdate.full_name"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          :placeholder="'Full Name' || ''"
        />
      </div>
      <div class="mb-4">
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          v-model="profileUpdate.bio"
          rows="4"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          :placeholder="'Bio' || ''"
        ></textarea>
      </div>
      <div class="mb-4">
        <label for="preferred_language" class="block text-sm font-medium text-gray-700">Preferred Language</label>
        <select
          id="preferred_language"
          v-model="profileUpdate.preferred_language"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="ko">Korean</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import type { ProfileUpdate } from '@/types/profile';

const profileStore = useProfileStore();
const profileUpdate = ref<ProfileUpdate>({
  full_name: '',
  bio: '',
  preferred_language: 'en',
});

const updateProfile = async () => {
  await profileStore.updateProfile(profileUpdate.value);
};

onMounted(() => {
  if (profileStore.profile) {
    profileUpdate.value = {
      full_name: profileStore.profile.profile_data.full_name || '',
      bio: profileStore.profile.profile_data.bio || '',
      preferred_language: profileStore.profile.profile_data.preferred_language || 'en',
    };
  }
});
</script>
