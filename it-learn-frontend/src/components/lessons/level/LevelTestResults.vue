<template>
  <div class="level-test-results bg-white rounded-lg shadow p-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Level Test Results</h2>
      <p class="text-gray-600 mt-2">
        {{ resultMessage }}
      </p>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <QuickStat
        label="Total Score"
        :value="score"
        suffix="%"
        icon="AcademicCapIcon"
      />
      <QuickStat
        label="Points Earned"
        :value="totalPoints"
        icon="StarIcon"
      />
      <QuickStat
        label="Time Taken"
        :value="formattedTime"
        type="text"
        icon="ClockIcon"
      />
    </div>

    <div class="achievements-section mb-8" v-if="passed && achievements.length">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Achievements Unlocked!
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          class="p-4 bg-primary-50 rounded-lg text-center"
        >
          <div class="text-2xl mb-2">{{ achievement.icon }}</div>
          <h4 class="font-medium text-primary-900">{{ achievement.name }}</h4>
          <p class="text-sm text-primary-600">{{ achievement.description }}</p>
        </div>
      </div>
    </div>

    <div class="questions-review space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Question Review</h3>
      
      <div 
        v-for="(answer, index) in answers" 
        :key="index"
        class="p-4 rounded-lg"
        :class="answer.isCorrect ? 'bg-green-50' : 'bg-red-50'"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-900">
                Question {{ index + 1 }}
              </p>
              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-1 text-sm rounded"
                  :class="answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ answer.points }} points
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ answer.question }}</p>
          </div>
        </div>
        
        <div class="mt-3 text-sm">
          <p class="text-gray-600">Your answer: {{ answer.userAnswer }}</p>
          <p v-if="!answer.isCorrect" class="text-gray-600 mt-1">
            Correct answer: {{ answer.correctAnswer }}
          </p>
          <p class="text-gray-500 mt-1">
            Time taken: {{ formatSeconds(answer.timeSpent) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <button
        @click="$emit('continue')"
        class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        {{ passed ? 'Continue to Next Level' : 'Return to Level' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  AcademicCapIcon, 
  StarIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline';
import QuickStat from '@/components/profile/QuickStat.vue';

interface TestAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const props = defineProps<{
  answers: TestAnswer[];
  totalTime: number;
  passingScore: number;
  achievements: Achievement[];
}>();

const emit = defineEmits<{
  (e: 'continue'): void;
}>();

const score = computed(() => {
  const totalPoints = props.answers.reduce((sum, answer) => sum + answer.points, 0);
  const maxPoints = props.answers.length * 100;
  return Math.round((totalPoints / maxPoints) * 100);
});

const totalPoints = computed(() => 
  props.answers.reduce((sum, answer) => sum + answer.points, 0)
);

const passed = computed(() => score.value >= props.passingScore);

const resultMessage = computed(() => {
  if (passed.value) {
    return 'Congratulations! You\'ve passed the level test!';
  }
  return `You need ${props.passingScore}% to pass. Keep practicing and try again!`;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(props.totalTime / 60);
  const seconds = props.totalTime % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const formatSeconds = (seconds: number) => {
  return `${seconds} seconds`;
};
</script>
