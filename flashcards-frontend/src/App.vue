<template>
  <div id="app">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="@/assets/logo.svg" alt="Logo" />
            </div>
          </div>
          <div class="flex items-center">
            <router-link to="/" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Home</router-link>
            <router-link v-if="!isAuthenticated" to="/auth/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Login</router-link>
            <router-link v-if="!isAuthenticated" to="/auth/register" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Register</router-link>
            <router-link v-if="isAuthenticated" to="/dashboard" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
            <button v-if="isAuthenticated" @click="logout" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isAuthenticated = ref(false);

onMounted(() => {
  isAuthenticated.value = store.state.auth.isAuthenticated;
});

const logout = async () => {
  try {
    await store.dispatch('auth/logout');
    router.push('/');
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>
