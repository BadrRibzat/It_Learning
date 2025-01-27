<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Profile Settings</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Profile Picture -->
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img
            :src="profileData.profile_picture || '/default-avatar.png'"
            alt="Profile picture"
            class="w-24 h-24 rounded-full object-cover"
          />
          <button
            type="button"
            @click="triggerFileInput"
            class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary-dark"
          >
            <font-awesome-icon icon="camera" />
          </button>
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleProfilePictureChange"
          />
        </div>
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          v-model="profileData.bio"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>

      <!-- Preferred Language -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Preferred Language
        </label>
        <LanguageSwitcher
          v-model="profileData.preferred_language"
          class="mt-1"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'ProfileForm',
  components: {
    LanguageSwitcher
  },
  setup() {
    const store = useStore();
    const fileInput = ref(null);
    const isLoading = ref(false);
    const initialData = ref(null);

    const profileData = ref({
      bio: '',
      preferred_language: 'en',
      profile_picture: null
    });

    const fetchProfileData = async () => {
      try {
        const response = await store.dispatch('profile/fetchProfile');
        profileData.value = {
          bio: response.profile_data.bio || '',
          preferred_language: response.profile_data.preferred_language || 'en',
          profile_picture: response.profile_data.profile_picture
        };
        initialData.value = { ...profileData.value };
      } catch (error) {
        NotificationService.showError('Failed to load profile data');
      }
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('profile/updateProfile', profileData.value);
        NotificationService.showSuccess('Profile updated successfully');
        initialData.value = { ...profileData.value };
      } catch (error) {
        NotificationService.showError('Failed to update profile');
      } finally {
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      profileData.value = { ...initialData.value };
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleProfilePictureChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('profile_picture', file);
          profileData.value.profile_picture = URL.createObjectURL(file);
          // You might want to implement actual file upload here
        } catch (error) {
          NotificationService.showError('Failed to update profile picture');
        }
      }
    };

    onMounted(fetchProfileData);

    return {
      profileData,
      isLoading,
      fileInput,
      handleSubmit,
      resetForm,
      triggerFileInput,
      handleProfilePictureChange
    };
  }
};
</script>
