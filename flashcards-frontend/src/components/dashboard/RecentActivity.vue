<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
    <ul>
      <li v-for="activity in activities" :key="activity.id" class="mb-4">
        <p class="text-gray-700">{{ activity.description }}</p>
        <p class="text-sm text-gray-500">{{ activity.date }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    required: true,
  },
})
</script>
