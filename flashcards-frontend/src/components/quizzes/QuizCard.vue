<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ quiz.title }}</h3>
    <p class="text-gray-700 mb-4">{{ quiz.description }}</p>
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500">Questions: {{ quiz.total_questions }}</span>
      <router-link 
        :to="`/dashboard/quizzes/${quiz.id}`" 
        class="bg-primary text-white px-4 py-2 rounded-lg"
      >
        Start Quiz
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});
</script>
