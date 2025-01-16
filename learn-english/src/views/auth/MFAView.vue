<template>
  <div class="mfa-view">
    <div class="card">
      <h1>Setup Multi-Factor Authentication</h1>
      <form @submit.prevent="setupMFA">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Setting up MFA...' : 'Setup MFA' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import AuthService from '@/services/api/AuthService';

export default {
  name: 'MFAView',
  setup() {
    const isLoading = ref(false);

    const setupMFA = async () => {
      isLoading.value = true;
      try {
        await AuthService.setupMFA();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      setupMFA,
    };
  },
};
</script>
