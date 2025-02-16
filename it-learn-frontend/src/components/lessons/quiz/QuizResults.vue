<template>
  <div class="quiz-results bg-white p-6 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Quiz Results</h2>
    <p class="text-gray-700">{{ results.score }}% Correct</p>
    <p class="text-gray-700">{{ results.correctAnswers }}/{{ results.totalQuestions }} Correct Answers</p>
    <p class="text-green-500 font-bold" v-if="results.passed">You passed!</p>
    <p class="text-red-500 font-bold" v-else>You did not pass. Try again.</p>
    <div class="mt-4">
      <button
        @click="$emit('continue')"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 w-full"
      >
        Continue to Next Lesson
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  results: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    passed: boolean;
  };
}>();

const emit = defineEmits(['continue']);
</script>

<style scoped>
.quiz-results {
  margin-top: 2rem;
}
</style>
