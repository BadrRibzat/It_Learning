<template>
  <div class="quiz-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ quiz.title }}</h3>
        <span class="px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-600">Quiz</span>
      </div>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">{{ quiz.description }}</p>
        <ProgressBar 
          :value="quiz.progress.completed_questions"
          :max="quiz.progress.total_questions"
          class="mb-2"
        />
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>{{ quiz.progress.completed_questions }}/{{ quiz.progress.total_questions }} Questions</span>
          <span>{{ quiz.progress.score }}% Score</span>
        </div>
        <button
          @click="handleQuizSelect"
          class="w-full px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Quiz } from '@/types/lessons';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  quiz: Quiz;
}>();

const emit = defineEmits<{
  (e: 'select-quiz', quiz: Quiz): void;
}>();

const handleQuizSelect = () => {
  emit('select-quiz', props.quiz);
};
</script>
