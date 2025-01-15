<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Forgot Password</h2>
    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div>
        <label for="forgot-email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input 
            id="forgot-email" 
            v-model="forgotPasswordForm.email" 
            type="email" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      </div>

      <button 
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset Password
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const forgotPasswordForm = ref({
  email: '',
});

const handleForgotPassword = async () => {
  try {
    await store.dispatch('auth/forgotPassword', forgotPasswordForm.value.email);
    alert('Password reset email sent!');
  } catch (error) {
    alert('Failed to send password reset email: ' + error.message);
  }
};
</script>
