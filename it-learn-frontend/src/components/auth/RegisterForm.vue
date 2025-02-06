<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="fullName" class="block text-sm font-medium leading-6 text-gray-900">
        Full Name
      </label>
      <div class="mt-2">
        <input
          v-model="formData.full_name"
          id="fullName"
          name="fullName"
          type="text"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.full_name 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
        <p v-if="errors.full_name" class="mt-2 text-sm text-red-600">{{ errors.full_name }}</p>
      </div>
    </div>

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

    <div>
      <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">
        Confirm Password
      </label>
      <div class="mt-2">
        <input
          v-model="formData.confirm_password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.confirm_password 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
        <p v-if="errors.confirm_password" class="mt-2 text-sm text-red-600">{{ errors.confirm_password }}</p>
      </div>
    </div>

    <div>
      <label for="dateOfBirth" class="block text-sm font-medium leading-6 text-gray-900">
        Date of Birth (Optional)
      </label>
      <div class="mt-2">
        <input
          v-model="formData.date_of_birth"
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.date_of_birth 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
        <p v-if="errors.date_of_birth" class="mt-2 text-sm text-red-600">{{ errors.date_of_birth }}</p>
      </div>
    </div>

    <div>
      <label for="language" class="block text-sm font-medium leading-6 text-gray-900">
        Preferred Language
      </label>
      <div class="mt-2">
        <select
          v-model="formData.current_language"
          id="language"
          name="language"
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            errors.current_language 
              ? 'ring-red-300 focus:ring-red-500 text-red-900' 
              : 'ring-gray-300 focus:ring-primary-600'
          ]"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
        </select>
        <p v-if="errors.current_language" class="mt-2 text-sm text-red-600">{{ errors.current_language }}</p>
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
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </div>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500">Already have an account?</span>
        </div>
      </div>
      <div class="mt-6 text-center">
        <RouterLink
          to="/login"
          class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
        >
          Sign in
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
import type { RegisterRequest } from '@/types/auth';

export default defineComponent({
  name: 'RegisterForm',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    const loading = ref(false);
    
    const formData = reactive<RegisterRequest>({
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      date_of_birth: '',
      current_language: 'en'
    });

    const errors = reactive({
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      date_of_birth: '',
      current_language: ''
    });

    const validateForm = (): boolean => {
      let isValid = true;
      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
      });

      // Validate full name
      if (!formData.full_name) {
        errors.full_name = 'Full name is required';
        isValid = false;
      }

      // Validate email
      if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate password
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }

      // Validate password confirmation
      if (!formData.confirm_password) {
        errors.confirm_password = 'Please confirm your password';
        isValid = false;
      } else if (formData.password !== formData.confirm_password) {
        errors.confirm_password = 'Passwords do not match';
        isValid = false;
      }

      // Validate date of birth (if provided)
      if (formData.date_of_birth) {
        const date = new Date(formData.date_of_birth);
        const now = new Date();
        if (date > now) {
          errors.date_of_birth = 'Date of birth cannot be in the future';
          isValid = false;
        }
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;
      try {
        await authStore.register(formData);
        toast.success('Registration successful! Welcome to IT Learning Platform.');
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
