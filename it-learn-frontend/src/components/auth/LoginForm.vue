<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
        Email address
      </label>
      <div class="mt-2">
        <input
          v-model="formData.email"
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.email 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
        <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
        Password
      </label>
      <div class="mt-2">
        <input
          v-model="formData.password"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.password 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
        <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          v-model="formData.rememberMe"
          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
        >
        <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-700">
          Remember me
        </label>
      </div>

      <div class="text-sm">
        <RouterLink 
          to="/forgot-password" 
          class="font-semibold text-primary-600 hover:text-primary-500"
        >
          Forgot password?
        </RouterLink>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="loading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500">Don't have an account?</span>
        </div>
      </div>
      <div class="mt-6 text-center">
        <RouterLink
          to="/register"
          class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
        >
          Register now
        </RouterLink>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import type { LoginRequest } from '@/types/auth';

interface FormData extends LoginRequest {
  rememberMe: boolean;
}

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    const loading = ref(false);
    
    const formData = reactive<FormData>({
      email: '',
      password: '',
      rememberMe: false
    });

    const errors = reactive({
      email: '',
      password: ''
    });

    const validateForm = (): boolean => {
      let isValid = true;
      errors.email = '';
      errors.password = '';

      if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;
      try {
        await authStore.login({
          email: formData.email,
          password: formData.password
        });
        
        // If remember me is checked, we could store some data in localStorage
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        router.push('/dashboard');
      } catch (error: any) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
});
</script>
