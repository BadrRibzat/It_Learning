<template>
  <div class="debug-component bg-gray-100 p-4 rounded-md">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Debug Information</h3>
    <pre class="text-sm text-gray-700">{{ debugInfo }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfileStore } from '@/stores/profile';

const profileStore = useProfileStore();

const debugInfo = computed(() => ({
  profile: profileStore.profile,
  loading: profileStore.loading,
}));
</script>

<style scoped>
.debug-component {
  max-height: 400px;
  overflow-y: auto;
}
</style>
