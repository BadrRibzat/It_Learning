<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-8">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg w-full">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const login = async () => {
  try {
    await store.dispatch('auth/login', { email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed', error);
  }
};
</script>
