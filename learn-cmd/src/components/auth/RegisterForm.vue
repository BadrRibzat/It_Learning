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
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          v-model="formData.full_name"
          type="text"
          id="full_name"
          required
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="formData.password"
          type="password"
          id="password"
          required
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div>
        <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          v-model="formData.confirm_password"
          type="password"
          id="confirm_password"
          required
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div>
        <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          v-model="formData.date_of_birth"
          type="date"
          id="date_of_birth"
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Preferred Language</label>
        <LanguageSwitcher
          v-model="formData.current_language"
          class="w-full"
        />
      </div>
    </div>

    <div class="mt-6">
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </div>

    <div class="mt-4 text-center">
      <router-link to="/auth/login" class="text-sm text-primary hover:text-primary-dark">
        Already have an account? Login
      </router-link>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'RegisterForm',
  components: {
    LanguageSwitcher
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const formData = ref({
      email: '',
      full_name: '',
      password: '',
      confirm_password: '',
      date_of_birth: '',
      current_language: 'en'
    });

    const validateForm = () => {
      if (formData.value.password !== formData.value.confirm_password) {
        NotificationService.showError('Passwords do not match');
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;
      try {
        await store.dispatch('auth/register', formData.value);
        NotificationService.showSuccess('Registration successful! Please login.');
        router.push('/auth/login');
      } catch (error) {
        NotificationService.showError(error.message || 'Registration failed');
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      handleSubmit
    };
  }
};
</script>
