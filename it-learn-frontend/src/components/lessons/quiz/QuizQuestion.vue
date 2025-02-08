<template>
  <div class="quiz-question bg-white rounded-lg shadow p-6">
    <div class="space-y-6">
      <div class="question-header flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Question {{ order }} of {{ total }}
        </h3>
        <span 
          class="px-3 py-1 text-sm rounded-full"
          :class="statusClass"
        >
          {{ timeRemaining }}
        </span>
      </div>

      <div class="question-content space-y-4">
        <p class="text-gray-700">{{ question.question }}</p>
        
        <div class="answer-input space-y-2">
          <input
            v-model="userAnswer"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            :placeholder="'Type your answer...'"
            :disabled="isSubmitted || isTimeUp"
            @keyup.enter="submitAnswer"
          />
          
          <div v-if="showFeedback" class="feedback-message">
            <p :class="feedbackClass" class="mt-2 text-sm font-medium">
              {{ feedbackMessage }}
            </p>
            <p v-if="isSubmitted && !isCorrect" class="mt-1 text-sm text-gray-600">
              Correct answer: {{ question.answer }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          v-if="!isSubmitted && !isTimeUp"
          @click="submitAnswer"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          :disabled="!userAnswer"
        >
          Submit Answer
        </button>
        <button
          v-else
          @click="$emit('next')"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Next Question
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Question } from '@/types/lessons';

const props = defineProps<{
  question: Question;
  order: number;
  total: number;
  timeLimit?: number;
}>();

const emit = defineEmits<{
  (e: 'submit', answer: string, timeSpent: number): void;
  (e: 'next'): void;
  (e: 'timeout'): void;
}>();

const userAnswer = ref('');
const isSubmitted = ref(false);
const isCorrect = ref(false);
const startTime = ref(Date.now());
const remainingTime = ref(props.timeLimit || 60);
let timer: number;

const isTimeUp = computed(() => remainingTime.value <= 0);

const timeRemaining = computed(() => {
  if (isTimeUp.value) return 'Time\'s up!';
  return `${remainingTime.value}s remaining`;
});

const statusClass = computed(() => {
  if (isTimeUp.value) return 'bg-red-100 text-red-600';
  if (remainingTime.value <= 10) return 'bg-yellow-100 text-yellow-600';
  return 'bg-gray-100 text-gray-600';
});

const showFeedback = computed(() => isSubmitted.value || isTimeUp.value);

const feedbackClass = computed(() => {
  if (!showFeedback.value) return '';
  return isCorrect.value ? 'text-green-600' : 'text-red-600';
});

const feedbackMessage = computed(() => {
  if (!showFeedback.value) return '';
  if (isTimeUp.value && !isSubmitted.value) return 'Time\'s up!';
  return isCorrect.value ? 'Correct! Well done!' : 'Incorrect answer.';
});

const submitAnswer = () => {
  if (isSubmitted.value || isTimeUp.value || !userAnswer.value) return;
  
  isSubmitted.value = true;
  isCorrect.value = userAnswer.value.trim().toLowerCase() === props.question.answer.toLowerCase();
  
  const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
  emit('submit', userAnswer.value, timeSpent);
};

onMounted(() => {
  timer = window.setInterval(() => {
    if (remainingTime.value > 0 && !isSubmitted.value) {
      remainingTime.value--;
      if (remainingTime.value === 0) {
        emit('timeout');
      }
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
