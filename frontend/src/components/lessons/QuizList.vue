<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Quizzes</h2>
    <div v-if="quizzes.length === 0" class="text-gray-600">
      No quizzes available for this lesson.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <QuizCard v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import QuizCard from './QuizCard.vue';

defineProps({
  quizzes: {
    type: Array,
    required: true,
  },
});
</script>
