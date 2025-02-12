<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            v-model="formData.full_name"
            id="fullName"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="formData.email"
            id="email"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            disabled
          />
        </div>
        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            v-model="formData.bio"
            id="bio"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="preferredLanguage" class="block text-sm font-medium text-gray-700">Preferred Language</label>
          <select
            v-model="formData.preferred_language"
            id="preferredLanguage"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Save
        </button>
        <button
          type="button"
          @click="handleDeleteAccount"
          class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Account
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { ProfileData, ProfileUpdate } from '@/types/profile';

const props = defineProps<{
  profile: ProfileData | null;
  loading: boolean;
}>();

const emits = defineEmits(['update', 'delete-account']);

const formData = ref<ProfileUpdate>({
  full_name: props.profile?.full_name || '',
  bio: props.profile?.bio || '',
  preferred_language: props.profile?.preferred_language || 'en'
});

const handleSubmit = () => {
  emits('update', formData.value);
};

const handleDeleteAccount = () => {
  emits('delete-account');
};
</script>
