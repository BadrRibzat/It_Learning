<template>
  <div class="quiz-results bg-white rounded-lg shadow p-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Quiz Results</h2>
      <p class="text-gray-600 mt-2">
        You've completed the lesson quiz!
      </p>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <QuickStat
        label="Score"
        :value="score"
        suffix="%"
        icon="AcademicCapIcon"
      />
      <QuickStat
        label="Correct Answers"
        :value="correctAnswers"
        :total="totalQuestions"
        icon="CheckCircleIcon"
      />
      <QuickStat
        label="Time Taken"
        :value="formattedTime"
        type="text"
        icon="ClockIcon"
      />
    </div>

    <div class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Question Review</h3>
      
      <div class="space-y-4">
        <div 
          v-for="(answer, index) in answers" 
          :key="index"
          class="p-4 rounded-lg"
          :class="answer.isCorrect ? 'bg-green-50' : 'bg-red-50'"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="font-medium text-gray-900">
                Question {{ index + 1 }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ answer.question }}
              </p>
            </div>
            <span 
              class="px-2 py-1 text-sm rounded"
              :class="answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ answer.isCorrect ? 'Correct' : 'Incorrect' }}
            </span>
          </div>
          
          <div class="mt-3 text-sm">
            <p class="text-gray-600">Your answer: {{ answer.userAnswer }}</p>
            <p v-if="!answer.isCorrect" class="text-gray-600 mt-1">
              Correct answer: {{ answer.correctAnswer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center space-x-4">
      <button
        v-if="passed"
        @click="$emit('continue')"
        class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Continue to Next Lesson
      </button>
      <button
        v-else
        @click="$emit('retry')"
        class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Retry Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  AcademicCapIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline';
import QuickStat from '@/components/profile/QuickStat.vue';

interface Answer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

const props = defineProps<{
  answers: Answer[];
  totalTime: number;
  passingScore: number;
}>();

const emit = defineEmits<{
  (e: 'continue'): void;
  (e: 'retry'): void;
}>();

const totalQuestions = computed(() => props.answers.length);
const correctAnswers = computed(() => props.answers.filter(a => a.isCorrect).length);
const score = computed(() => Math.round((correctAnswers.value / totalQuestions.value) * 100));
const passed = computed(() => score.value >= props.passingScore);

const formattedTime = computed(() => {
  const minutes = Math.floor(props.totalTime / 60);
  const seconds = props.totalTime % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});
</script>
