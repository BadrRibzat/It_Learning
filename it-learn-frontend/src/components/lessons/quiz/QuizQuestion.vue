<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { useProfileStore } from '@/stores/profile';
import type { Question } from '@/types/lessons';

const notificationStore = useNotificationStore();
const profileStore = useProfileStore();

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
const startTime = ref(Date.now());
let timer: number;

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const timerClass = computed(() => {
  if (timeLeft.value <= 10) return 'text-red-600';
  if (timeLeft.value <= 30) return 'text-yellow-600';
  return 'text-green-600';
});

const calculatePoints = (timeSpent: number): number => {
  const maxPoints = 100;
  const timeRatio = 1 - (timeSpent / props.timeLimit);
  return Math.max(Math.floor(maxPoints * timeRatio), 10);
};

const submitAnswer = async () => {
  if (!answer.value.trim() || hasSubmitted.value) return;
  
  try {
    const timeSpent = props.timeLimit - timeLeft.value;
    const points = calculatePoints(timeSpent);
    hasSubmitted.value = true;

    const isCorrect = answer.value.trim().toLowerCase() === props.question.answer.toLowerCase();
    
    if (isCorrect) {
      notificationStore.success(`Correct! +${points} points`);
      await profileStore.updateLearningStats({
        points_earned: points,
        correct_answers: 1,
        total_questions: 1
      });
    } else {
      notificationStore.warning('Incorrect answer. Keep trying!');
    }

    emit('submit', answer.value, timeSpent);
  } catch (error) {
    notificationStore.error('Failed to submit answer. Please try again.');
  }
};

const handleNext = () => {
  emit('next');
  hasSubmitted.value = false;
  answer.value = '';
  timeLeft.value = props.timeLimit;
  startTime.value = Date.now();
};

onMounted(() => {
  timer = window.setInterval(() => {
    if (timeLeft.value > 0 && !hasSubmitted.value) {
      timeLeft.value--;
      if (timeLeft.value === 30) {
        notificationStore.warning('30 seconds remaining!');
      }
      if (timeLeft.value === 0) {
        notificationStore.error('Time\'s up!');
        emit('timeout');
      }
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="quiz-question space-y-6 bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-500">
        Question {{ order }} of {{ total }}
      </span>
      <div class="text-sm" :class="timerClass">
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
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          placeholder="Type your answer..."
          :disabled="hasSubmitted"
          @keyup.enter="submitAnswer"
        />

        <button
          v-if="!hasSubmitted"
          @click="submitAnswer"
          class="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          :disabled="!answer.trim()"
        >
          Submit Answer
        </button>

        <button
          v-else
          @click="handleNext"
          class="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Next Question
        </button>
      </div>
    </div>

    <div v-if="hasSubmitted" class="mt-4 p-4 rounded-lg" 
         :class="answer.trim().toLowerCase() === question.answer.toLowerCase() ? 'bg-green-50' : 'bg-red-50'">
      <p class="text-sm font-medium" 
         :class="answer.trim().toLowerCase() === question.answer.toLowerCase() ? 'text-green-700' : 'text-red-700'">
        {{ answer.trim().toLowerCase() === question.answer.toLowerCase() ? 'Correct!' : 'Incorrect. The correct answer is:' }}
      </p>
      <p v-if="answer.trim().toLowerCase() !== question.answer.toLowerCase()" 
         class="mt-1 text-sm text-gray-600">
        {{ question.answer }}
      </p>
    </div>
  </div>
</template>

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
