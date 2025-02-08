<template>
  <div class="level-test-question bg-white rounded-lg shadow p-6">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Question {{ order }} of {{ total }}
        </h3>
        <div class="flex items-center space-x-2">
          <span 
            class="px-3 py-1 text-sm rounded-full"
            :class="timerClass"
          >
            {{ timeRemaining }}
          </span>
          <span class="text-sm text-gray-600">
            Points: {{ questionPoints }}
          </span>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-gray-700">{{ question.question }}</p>
        
        <div class="answer-section space-y-2">
          <input
            v-model="userAnswer"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            :placeholder="'Type your answer...'"
            :disabled="isSubmitted || isTimeUp"
            @keyup.enter="submitAnswer"
          />
          
          <div v-if="showFeedback" class="mt-2">
            <p :class="feedbackClass" class="text-sm font-medium">
              {{ feedbackMessage }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
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
import type { LevelTestQuestion } from '@/types/lessons';

const props = defineProps<{
  question: LevelTestQuestion;
  order: number;
  total: number;
  timeLimit: number;
}>();

const emit = defineEmits<{
  (e: 'submit', answer: string, timeSpent: number, points: number): void;
  (e: 'next'): void;
  (e: 'timeout'): void;
}>();

const userAnswer = ref('');
const isSubmitted = ref(false);
const remainingTime = ref(props.timeLimit);
const timer = ref<number>();

const isTimeUp = computed(() => remainingTime.value <= 0);
const showFeedback = computed(() => isSubmitted.value || isTimeUp.value);

const questionPoints = computed(() => {
  if (remainingTime.value >= props.timeLimit * 0.75) return 100;
  if (remainingTime.value >= props.timeLimit * 0.5) return 75;
  if (remainingTime.value >= props.timeLimit * 0.25) return 50;
  return 25;
});

const timeRemaining = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const timerClass = computed(() => {
  if (isTimeUp.value) return 'bg-red-100 text-red-600';
  if (remainingTime.value <= props.timeLimit * 0.25) return 'bg-yellow-100 text-yellow-600';
  return 'bg-green-100 text-green-600';
});

const feedbackClass = computed(() => {
  if (!showFeedback.value) return '';
  if (isTimeUp.value) return 'text-red-600';
  return userAnswer.value.toLowerCase() === props.question.answer.toLowerCase()
    ? 'text-green-600'
    : 'text-red-600';
});

const feedbackMessage = computed(() => {
  if (!showFeedback.value) return '';
  if (isTimeUp.value) return 'Time\'s up!';
  return userAnswer.value.toLowerCase() === props.question.answer.toLowerCase()
    ? `Correct! You earned ${questionPoints.value} points!`
    : 'Incorrect answer.';
});

const submitAnswer = () => {
  if (isSubmitted.value || isTimeUp.value || !userAnswer.value) return;
  
  isSubmitted.value = true;
  const timeSpent = props.timeLimit - remainingTime.value;
  emit('submit', userAnswer.value, timeSpent, questionPoints.value);
};

onMounted(() => {
  timer.value = window.setInterval(() => {
    if (remainingTime.value > 0 && !isSubmitted.value) {
      remainingTime.value--;
      if (remainingTime.value === 0) {
        emit('timeout');
      }
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>
