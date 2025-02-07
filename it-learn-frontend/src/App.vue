<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import '@/assets/main.css';

const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth state if needed
  if (authStore.isAuthenticated) {
    authStore.initializeAuth();
  }
});
</script>

<style>
@import '@/assets/base.css';
</style>
