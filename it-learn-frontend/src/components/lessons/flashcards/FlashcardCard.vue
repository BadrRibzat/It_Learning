<template>
  <div class="flashcard-card bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-bold mb-4">{{ flashcard.command }}</h3>
    <p class="text-gray-700">{{ flashcard.question }}</p>
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
    <div v-if="feedbackMessage" class="mt-4">
      <p :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ feedbackMessage }}</p>
      <p v-if="!isCorrect" class="text-gray-600">Correct answer: {{ flashcard.answer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Flashcard } from '@/types/lessons';

const props = defineProps<{
  flashcard: Flashcard;
}>();

const emit = defineEmits(['submit-answer']);

const userAnswer = ref('');
const isCorrect = ref(false);
const feedbackMessage = ref('');

const handleSubmit = () => {
  const correct = userAnswer.value.trim().toLowerCase() === props.flashcard.answer.toLowerCase();
  isCorrect.value = correct;
  feedbackMessage.value = correct ? 'Correct!' : 'Incorrect!';
  
  emit('submit-answer', {
    flashcard_id: props.flashcard.id,
    user_answer: userAnswer.value,
    expected_answer: props.flashcard.answer,
  });
};
</script>

<style scoped>
.flashcard-card {
  margin-bottom: 1rem;
}
</style>
