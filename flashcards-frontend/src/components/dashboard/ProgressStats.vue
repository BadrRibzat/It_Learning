<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">Progress Statistics</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-gray-700">Completed Lessons</p>
        <p class="text-2xl font-bold">{{ stats.completedLessons }}</p>
      </div>
      <div>
        <p class="text-gray-700">Total Points</p>
        <p class="text-2xl font-bold">{{ stats.totalPoints }}</p>
      </div>
      <div>
        <p class="text-gray-700">Correct Answers</p>
        <p class="text-2xl font-bold">{{ stats.correctAnswers }}</p>
      </div>
      <div>
        <p class="text-gray-700">Total Questions</p>
        <p class="text-2xl font-bold">{{ stats.totalQuestions }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>
