<template>
  <form @submit.prevent="submitForm">
    <div class="rounded-md shadow-sm space-y-4">
      <div>
        <label for="token" class="sr-only">Reset Token</label>
        <input
          id="token"
          v-model="form.token"
          type="text"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Reset Token"
        />
      </div>
      <div>
        <label for="newPassword" class="sr-only">New Password</label>
        <input
          id="newPassword"
          v-model="form.newPassword"
          type="password"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="New Password"
        />
      </div>
      <div>
        <label for="confirmPassword" class="sr-only">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Confirm Password"
        />
      </div>
    </div>
    <div>
      <button
        type="submit"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Reset Password
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({
      token: '',
      newPassword: '',
      confirmPassword: '',
    });

    const submitForm = async () => {
      if (form.value.newPassword !== form.value.confirmPassword) {
        NotificationService.showError('Passwords do not match!');
        return;
      }
      try {
        await store.dispatch('auth/confirmPasswordReset', {
          token: form.value.token,
          newPassword: form.value.newPassword,
        });
        NotificationService.showSuccess('Password reset successfully!');
        router.push('/auth/login');
      } catch (error) {
        NotificationService.handleAuthError(error);
      }
    };

    return { form, submitForm };
  },
};
</script>
