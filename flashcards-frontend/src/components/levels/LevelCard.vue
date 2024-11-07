<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ level.name }}</h3>
    <p class="text-gray-700 mb-4">Level Order: {{ level.level_order }}</p>
    <router-link :to="`/dashboard/levels/${level.id}/test`" class="bg-primary text-white px-4 py-2 rounded-lg">Take Test</router-link>
  </div>
</template>

<script setup>
defineProps({
  level: {
    type: Object,
    required: true,
  },
})
</script>
