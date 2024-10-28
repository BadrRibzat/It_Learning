<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-primary">Learn English</router-link>
            </div>
            <div class="hidden md:ml-6 md:flex md:items-center">
              <router-link to="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</router-link>
              <router-link to="/lessons" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Lessons</router-link>
              <router-link to="/notes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Notes</router-link>
              <router-link to="/profile" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">Profile</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <router-link to="/chat" class="text-gray-500 hover:text-gray-900">
              <font-awesome-icon :icon="['fas', 'comments']" />
            </router-link>
            <div class="flex-shrink-0 ml-4">
              <router-link to="/auth/login" v-if="!isAuthenticated" class="text-sm font-medium text-gray-500 hover:text-gray-900">Login</router-link>
              <router-link to="/auth/register" v-if="!isAuthenticated" class="ml-4 text-sm font-medium text-primary hover:text-primary-dark">Register</router-link>
              <button v-else @click="logout" class="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main>
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

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

const logout = async () => {
  await store.dispatch('auth/logout');
  router.push('/auth/login');
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
