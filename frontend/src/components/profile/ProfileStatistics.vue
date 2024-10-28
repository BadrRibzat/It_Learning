<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-4">Statistics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Total Lessons Completed</h3>
        <p class="text-gray-600">{{ statistics.lessonsCompleted }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Total Points</h3>
        <p class="text-gray-600">{{ statistics.totalPoints }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Current Level</h3>
        <p class="text-gray-600">{{ statistics.currentLevel }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Learning Streak</h3>
        <p class="text-gray-600">{{ statistics.learningStreak }} days</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  statistics: {
    type: Object,
    required: true,
  },
});
</script>
