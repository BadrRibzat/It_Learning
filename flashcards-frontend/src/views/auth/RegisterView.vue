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
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 border rounded-lg" 
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
        >
          Register
        </button>
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

const handleRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    alert("Passwords don't match");
    return;
  }
  try {
    await register({
      username: username.value,
      email: email.value,
      password: password.value
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script>
