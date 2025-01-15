<template>
  <button
    type="button"
    @click="handleGoogleAuth"
    :disabled="loading"
    class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  >
    <font-awesome-icon
      :icon="['fab', 'google']"
      class="h-5 w-5 text-red-500 mr-2"
    />
    {{ loading ? $t('common.loading') : $t('auth.googleAuth') }}
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { googleAuthService } from '@/api/services/google-auth';
import { useNotification } from '@/composables/useNotification';

const { show } = useNotification();
const loading = ref(false);

const handleGoogleAuth = async () => {
  try {
    loading.value = true;
    const { data } = await googleAuthService.initialize();
    window.location.href = data.authorization_url;
  } catch (error) {
    show(error.message || 'Google authentication failed', 'error');
  } finally {
    loading.value = false;
  }
};
</script>
