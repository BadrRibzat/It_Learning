<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-primary">Learn English</router-link>
            </div>
            <div class="hidden md:ml-6 md:flex md:items-center">
              <router-link v-if="isAuthenticated" to="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</router-link>
              <router-link v-if="isAuthenticated" to="/levels" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Levels</router-link>
              <router-link v-if="isAuthenticated" to="/lessons" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Lessons</router-link>
              <router-link v-if="isAuthenticated" to="/notes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Notes</router-link>
              <router-link v-if="isAuthenticated" to="/profile" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Profile</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <router-link v-if="isAuthenticated" to="/chat" class="text-gray-500 hover:text-gray-900">
              <font-awesome-icon :icon="['fas', 'comments']" />
            </router-link>
            <div class="flex-shrink-0 ml-4">
              <template v-if="!isAuthenticated">
                <router-link to="/auth/login" class="text-sm font-medium text-gray-500 hover:text-gray-900">Login</router-link>
                <router-link to="/auth/register" class="ml-4 text-sm font-medium text-primary hover:text-primary-dark">Register</router-link>
              </template>
              <button v-if="isAuthenticated" @click="handleLogout" class="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow">
      <router-view />
    </main>
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-base text-gray-400">
            &copy; 2023 Learn English. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    <Chatbot v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Chatbot from '@/components/chat/Chatbot.vue';
import { useNotification } from '@/composables/useNotification';

const store = useStore();
const router = useRouter();
const { show } = useNotification();

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

const handleLogout = async () => {
  if (isAuthenticated.value) {
    try {
      await store.dispatch('auth/logout');
      show('Logout successful', 'success');
      router.push('/auth/login');
    } catch (error) {
      show('Logout failed', 'error');
    }
  } else {
    router.push('/auth/login');
  }
};
</script>
