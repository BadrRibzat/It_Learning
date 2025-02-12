<template>
  <div class="settings-form">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Notifications -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
          <div class="space-y-1">
            <div class="flex items-center">
              <Switch
                v-model="formData.notifications.achievements"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Achievements</span>
            </div>
            <div class="flex items-center">
              <Switch
                v-model="formData.notifications.progress"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Progress</span>
            </div>
            <div class="flex items-center">
              <Switch
                v-model="formData.notifications.streaks"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Streaks</span>
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
          <div class="space-y-1">
            <div class="flex items-center">
              <Switch
                v-model="formData.privacy.public_profile"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Public Profile</span>
            </div>
            <div class="flex items-center">
              <Switch
                v-model="formData.privacy.show_achievements"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Show Achievements</span>
            </div>
            <div class="flex items-center">
              <Switch
                v-model="formData.privacy.show_activity"
                class="mr-2"
              />
              <span class="text-sm text-gray-700">Show Activity</span>
            </div>
          </div>
        </div>

        <!-- Language -->
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
      <div class="mt-6 flex justify-end">
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { ProfileSettings } from '@/types/profile';
import Switch from '@/components/common/Switch.vue';

const props = defineProps<{
  profile: ProfileSettings | null;
}>();

const emits = defineEmits(['update']);

const formData = ref({
  preferred_language: props.profile?.preferred_language || 'en',
  notifications: {
    achievements: props.profile?.notifications.achievements || false,
    progress: props.profile?.notifications.progress || false,
    streaks: props.profile?.notifications.streaks || false,
  },
  privacy: {
    public_profile: props.profile?.privacy.public_profile || false,
    show_achievements: props.profile?.privacy.show_achievements || false,
    show_activity: props.profile?.privacy.show_activity || false,
  },
});

const handleSubmit = () => {
  emits('update', formData.value);
};
</script>

<style scoped>
.settings-form {
  max-width: 24rem;
}

.settings-form label {
  display: block;
}

.settings-form select {
  width: 100%;
}

.settings-form .switch {
  width: 2.5rem;
  height: 1.5rem;
}

.settings-form .switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.settings-form .switch input:checked + .slider {
  background-color: #2196F3;
}

.settings-form .switch input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

.settings-form .switch .slider {
  position: relative;
  cursor: pointer;
  width: 2.5rem;
  height: 1.5rem;
  border-radius: 1rem;
  background-color: #ccc;
  transition: background-color 0.3s;
}

.settings-form .switch .slider:before {
  position: absolute;
  content: '';
  height: 1.25rem;
  width: 1.25rem;
  left: 0.25rem;
  bottom: 0.125rem;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s;
}
</style>