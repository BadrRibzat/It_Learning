<template>
  <div class="settings-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="loadSettings" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Notifications Section -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Achievement Notifications</label>
                <Switch
                  v-model="settings.notifications.achievements"
                  class="ml-4"
                />
              </div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Progress Updates</label>
                <Switch
                  v-model="settings.notifications.progress"
                  class="ml-4"
                />
              </div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Streak Reminders</label>
                <Switch
                  v-model="settings.notifications.streaks"
                  class="ml-4"
                />
              </div>
            </div>
          </div>

          <!-- Privacy Section -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">Privacy</h2>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Public Profile</label>
                <Switch
                  v-model="settings.privacy.public_profile"
                  class="ml-4"
                />
              </div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Show Achievements</label>
                <Switch
                  v-model="settings.privacy.show_achievements"
                  class="ml-4"
                />
              </div>
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-700">Show Activity</label>
                <Switch
                  v-model="settings.privacy.show_activity"
                  class="ml-4"
                />
              </div>
            </div>
          </div>

          <!-- Language Section -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">Language</h2>
            <div>
              <label class="block text-sm text-gray-700">Preferred Language</label>
              <select
                v-model="settings.preferred_language"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="updating"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useProfileStore } from '@/stores/profile';
import type { ProfileSettings } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Switch from '@/components/common/Switch.vue';

const toast = useToast();
const profileStore = useProfileStore();

const loading = ref(true);
const updating = ref(false);
const error = ref<string | null>(null);
const settings = ref<ProfileSettings>({
  notifications: {
    achievements: true,
    progress: true,
    streaks: true
  },
  privacy: {
    public_profile: true,
    show_achievements: true,
    show_activity: true
  },
  preferred_language: 'en'
});

const loadSettings = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await profileStore.fetchSettings();
    settings.value = response.settings;
  } catch (err) {
    error.value = 'Failed to load settings';
    toast.error('Failed to load settings');
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    updating.value = true;
    await profileStore.updateSettings(settings.value);
    toast.success('Settings updated successfully');
  } catch (err) {
    toast.error('Failed to update settings');
  } finally {
    updating.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 4rem);
}

.switch {
  @apply ml-4;
}

.disabled:opacity-50 {
  opacity: 0.5;
}

@media (min-width: 640px) {
  .settings-page {
    padding-top: 2rem;
  }
}

@media (min-width: 768px) {
  .settings-page {
    padding-top: 4rem;
  }
}

@media (min-width: 1024px) {
  .settings-page {
    padding-top: 6rem;
  }
}

@media (min-width: 1280px) {
  .settings-page {
    padding-top: 8rem;
  }
}

@media (min-width: 1536px) {
  .settings-page {
    padding-top: 10rem;
  }
}
/*
 In the code above, we have a  ProfileSettingsView  component that displays a form with different sections for notifications, privacy, and language settings. The form is populated with the user's settings fetched from the API. The user can update the settings and save them by submitting the form. 
 The component uses the  useProfileStore  composition function to interact with the profile store. It fetches the user's settings when the component is mounted and updates the settings when the form is submitted. 
 The  ProfileSettingsView  component uses the  Switch  component to render toggle switches for the notification and privacy settings. The  Switch  component is a custom component that we'll create next. 
 Create a Switch Component 
 Let's create a  Switch  component that renders a toggle switch input. The component will accept a  v-model  prop to bind the switch value to a parent component. 
 Create a new file named  Switch.vue  inside the  src/components/common  directory and add the following code:
*/
</style>