<template>
  <div class="forgot-password-view">
    <div class="card">
      <h1>Forgot Password</h1>
      <form @submit.prevent="forgotPassword">
        <input type="email" v-model="email" placeholder="Enter your email" required />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Sending email...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import AuthService from '@/services/api/AuthService';

export default {
  name: 'ForgotPasswordView',
  setup() {
    const email = ref('');
    const isLoading = ref(false);

    const forgotPassword = async () => {
      isLoading.value = true;
      try {
        await AuthService.forgotPassword(email.value);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      isLoading,
      forgotPassword,
    };
  },
};
</script>
