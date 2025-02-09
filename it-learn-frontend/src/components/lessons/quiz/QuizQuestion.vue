<template>
  <div class="quiz-question space-y-6 bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-500">
        Question {{ order }} of {{ total }}
      </span>
      <div class="text-sm text-gray-500">
        Time remaining: {{ formattedTimeLeft }}
      </div>
    </div>

    <div class="question-content space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ question.question }}
      </h3>

      <div class="answer-input space-y-2">
        <input
          v-model="answer"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Type your answer..."
          :disabled="hasSubmitted"
          @keyup.enter="submitAnswer"
        />

        <button
          v-if="!hasSubmitted"
          @click="submitAnswer"
          class="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          :disabled="!answer.trim()"
        >
          Submit Answer
        </button>

        <button
          v-else
          @click="handleNext"
          class="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next Question
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { Question } from '@/types/lessons';

const props = defineProps<{
  question: Question;
  order: number;
  total: number;
  timeLimit: number;
}>();

const emit = defineEmits<{
  (e: 'submit', answer: string, timeSpent: number): void;
  (e: 'next'): void;
  (e: 'timeout'): void;
}>();

const answer = ref('');
const hasSubmitted = ref(false);
const timeLeft = ref(props.timeLimit);
let timer: number;

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const submitAnswer = () => {
  if (!answer.value.trim() || hasSubmitted.value) return;
  
  const timeSpent = props.timeLimit - timeLeft.value;
  hasSubmitted.value = true;
  emit('submit', answer.value, timeSpent);
};

const handleNext = () => {
  emit('next');
  hasSubmitted.value = false;
  answer.value = '';
  timeLeft.value = props.timeLimit;
};

onMounted(() => {
  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      if (!hasSubmitted.value) {
        emit('timeout');
      }
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
