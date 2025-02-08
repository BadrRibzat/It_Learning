<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold">{{ profile?.full_name || 'Full Name' }}</h2>
      <p class="text-gray-600">{{ profile?.email || 'Email' }}</p>
      <p class="text-sm text-gray-500">
        Member since {{ formatDate(profile?.joined_date) }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700">
          Full Name <span class="text-red-500">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          v-model="formData.full_name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :class="{ 'border-red-500': validationErrors.full_name }"
          :disabled="isSaving"
        />
        <p v-if="validationErrors.full_name" class="mt-1 text-sm text-red-600">
          {{ validationErrors.full_name }}
        </p>
      </div>

      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          name="bio"
          v-model="formData.bio"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :disabled="isSaving"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>

      <div>
        <label for="preferred_language" class="block text-sm font-medium text-gray-700">
          Preferred Language
        </label>
        <select
          id="preferred_language"
          name="preferred_language"
          v-model="formData.preferred_language"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :disabled="isSaving"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
          :disabled="!isFormChanged || isSaving"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-primary-400"
          :disabled="!isFormChanged || isSaving"
        >
          <span v-if="isSaving" class="flex items-center">
            <LoadingSpinner class="w-4 h-4 mr-2" />
            Saving...
          </span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-200">
      <p class="text-sm text-gray-600">
        Last active: {{ formatDate(profile?.last_active, true) }}
      </p>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Account Management</h3>
      <div class="mt-4">
        <button
          @click="confirmDeleteAccount"
          class="text-red-600 hover:text-red-700 text-sm font-medium disabled:text-red-400"
          :disabled="isSaving"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import type { ProfileData } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

interface ProfileUpdateRequest {
  full_name?: string;
  bio?: string;
  preferred_language?: string;
}

const props = defineProps<{
  profile?: ProfileData;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', data: ProfileUpdateRequest): void;
  (e: 'delete-account'): void;
}>();

const toast = useToast();
const isSaving = ref(false);
const validationErrors = ref<Record<string, string>>({});

const formData = ref<ProfileUpdateRequest>({
  full_name: '',
  bio: '',
  preferred_language: 'en',
});

const initialFormData = ref<ProfileUpdateRequest>({ ...formData.value });

watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    formData.value = {
      full_name: newProfile.full_name || '',
      bio: newProfile.bio || '',
      preferred_language: newProfile.preferred_language || 'en',
    };
    initialFormData.value = { ...formData.value };
  }
}, { immediate: true });

const isFormChanged = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(initialFormData.value);
});

const validateForm = (): boolean => {
  validationErrors.value = {};
  
  if (!formData.value.full_name?.trim()) {
    validationErrors.value.full_name = 'Full name is required';
    return false;
  }
  
  if (formData.value.full_name.length > 100) {
    validationErrors.value.full_name = 'Full name must be less than 100 characters';
    return false;
  }
  
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    isSaving.value = true;
    await emit('update', formData.value);
    initialFormData.value = { ...formData.value };
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  formData.value = { ...initialFormData.value };
  validationErrors.value = {};
};

const confirmDeleteAccount = () => {
  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    emit('delete-account');
  }
};

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
</script>
