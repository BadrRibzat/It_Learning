<template>
  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="formData.email"
          type="email"
          id="email"
          required
          autocomplete="email"
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          :class="{ 'border-red-500': errors.email }"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="formData.password"
          type="password"
          id="password"
          required
          autocomplete="current-password"
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          :class="{ 'border-red-500': errors.password }"
        />
      </div>
    </div>

    <div class="mt-6">
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </div>

    <div class="mt-4 text-center space-y-2">
      <router-link to="/auth/register" class="text-sm text-primary hover:text-primary-dark block">
        Don't have an account? Register
      </router-link>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LoginForm',
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);
    const errors = ref({});

    const formData = ref({
      email: '',
      password: ''
    });

    const handleSubmit = async () => {
      loading.value = true;
      errors.value = {};

      try {
        const response = await store.dispatch('auth/login', formData.value);
        NotificationService.showSuccess('Login successful!');
      } catch (error) {
        NotificationService.showError(error.message || 'Login failed');
        errors.value = error.errors || {};
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      errors,
      handleSubmit
    };
  }
};
</script>
