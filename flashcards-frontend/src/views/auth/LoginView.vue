<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-8">{{ $t('auth.signIn') }}</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">{{ $t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg"
            autocomplete="email"
            required
          />
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">{{ $t('auth.password') }}</label>
          <div class="flex items-center">
            <input
              v-model="password"
              :type="passwordType"
              class="w-full px-4 py-2 border rounded-lg pr-10"
              autocomplete="current-password"
              required
            />
            <button 
              type="button" 
              @click="togglePasswordVisibility" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <font-awesome-icon :icon="isPasswordVisible ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="bg-primary text-white px-4 py-2 rounded-lg w-full"
        >
          {{ $t('auth.signIn') }}
        </button>
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { usePasswordToggle } from '@/utils/passwordToggle';

const store = useStore();
const router = useRouter();

const { 
  isPasswordVisible, 
  passwordType, 
  togglePasswordVisibility 
} = usePasswordToggle();

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    });
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.detail || 'Login failed';
  }
};
</script>
