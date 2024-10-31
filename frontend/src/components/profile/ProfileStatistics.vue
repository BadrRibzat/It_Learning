<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-4">Statistics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Total Lessons Completed</h3>
        <p class="text-gray-600">{{ statistics.completed_lessons }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Total Points</h3>
        <p class="text-gray-600">{{ statistics.total_points }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Current Level</h3>
        <p class="text-gray-600">{{ statistics.current_level }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2">Correct Flashcards</h3>
        <p class="text-gray-600">{{ statistics.correct_flashcards }} / {{ statistics.total_flashcards }}</p>
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
