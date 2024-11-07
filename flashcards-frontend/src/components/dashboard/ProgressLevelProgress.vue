<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">Level Progress</h3>
    <p class="text-gray-700">Completed: {{ levelProgress.completed ? 'Yes' : 'No' }}</p>
    <p class="text-gray-700">Correct Answers: {{ levelProgress.correct_answers }}</p>
    <p class="text-gray-700">Total Questions: {{ levelProgress.total_questions }}</p>
  </div>
</template>

<script setup>
defineProps({
  levelProgress: {
    type: Object,
    required: true,
  },
});
</script>
