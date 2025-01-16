<template>
  <div class="verify-email-view">
    <div class="card">
      <h1>Verify Email</h1>
      <form @submit.prevent="verifyEmail">
        <input type="text" v-model="token" placeholder="Enter verification token" required />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Verifying...' : 'Verify Email' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import AuthService from '@/services/api/AuthService';

export default {
  name: 'VerifyEmailView',
  setup() {
    const token = ref('');
    const isLoading = ref(false);

    const verifyEmail = async () => {
      isLoading.value = true;
      try {
        await AuthService.verifyEmail(token.value);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      token,
      isLoading,
      verifyEmail,
    };
  },
};
</script>
