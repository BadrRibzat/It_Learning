<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import '@/assets/main.css';

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.initializeAuth();
  }
});
</script>

<style scoped>
@import '@/assets/base.css';
</style>