<template>
  <div class="quiz-question space-y-6 bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-500">
        Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
      </span>
    </div>

    <div class="question-content space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ currentQuestion.question }}
      </h3>

      <div class="answer-input space-y-2">
        <input
          v-model="answers[currentQuestionIndex]"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          placeholder="Type your answer..."
          @keyup.enter="nextQuestion"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <button
        v-if="currentQuestionIndex > 0"
        @click="prevQuestion"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        Previous
      </button>
      <button
        v-if="currentQuestionIndex < questions.length - 1"
        @click="nextQuestion"
        class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        Next
      </button>
      <button
        v-else
        @click="submitAnswer"
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Question } from '@/types/lessons';

const props = defineProps<{
  questions: Question[];
  timeLimit: number;
}>();

const emit = defineEmits<{
  (e: 'submit', answers: string[]): void;
}>();

const currentQuestionIndex = ref(0);
const answers = ref<string[]>(Array(props.questions.length).fill(''));

const currentQuestion = computed(() => props.questions[currentQuestionIndex.value]);

const nextQuestion = () => {
  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const submitAnswer = () => {
  emit('submit', answers.value);
};
</script>

<style scoped>
.quiz-question {
  transition: all 0.3s ease-in-out;
}

.answer-input input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
