<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-8">Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full px-4 py-2 border rounded-lg" 
            autocomplete="username"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 border rounded-lg" 
            autocomplete="email"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 border rounded-lg" 
            autocomplete="new-password"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Confirm Password</label>
          <input 
            v-model="passwordConfirmation" 
            type="password" 
            class="w-full px-4 py-2 border rounded-lg" 
            autocomplete="new-password"
            required
          />
        </div>
        <button 
          type="submit" 
          class="bg-primary text-white px-4 py-2 rounded-lg w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
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
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { register } = useAuth();
const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = "Passwords don't match";
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';
    const userData = {
      username: username.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    };
    
    await register(userData);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.detail || 'Registration failed';
  } finally {
    isLoading.value = false;
  }
};
</script>
