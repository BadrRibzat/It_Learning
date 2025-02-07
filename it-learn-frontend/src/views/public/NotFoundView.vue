<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary-600">404</h1>
      <p class="mt-4 text-lg text-gray-600">Page Not Found</p>
      <RouterLink to="/" class="mt-6 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-500">
        Go to Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
