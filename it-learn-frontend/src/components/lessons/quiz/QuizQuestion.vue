<template>
  <div class="quiz-question bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-bold mb-4">Question {{ index + 1 }} of {{ totalQuestions }}</h3>
    <p class="text-gray-700">{{ question.question }}</p>
    <form @submit.prevent="handleSubmit">
      <input
        v-model="userAnswer"
        type="text"
        class="mt-4 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
        placeholder="Enter your answer"
      />
      <button
        type="submit"
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 w-full"
      >
        Submit Answer
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { Question } from '@/types/lessons';

const props = defineProps<{
  question: Question;
  index: number;
  totalQuestions: number;
}>();

const emit = defineEmits(['submit-answer']);

const userAnswer = ref('');

const handleSubmit = () => {
  emit('submit-answer', userAnswer.value);
};
</script>

<style scoped>
.quiz-question {
  margin-bottom: 1rem;
}
</style>
