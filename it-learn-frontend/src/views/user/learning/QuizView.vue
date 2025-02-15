<template>
  <div class="quiz-view space-y-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeQuiz" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 class="text-xl font-bold text-gray-900">Lesson Quiz</h2>

          <p class="text-gray-600">Time Spent: {{ formattedTimeSpent }}</p>

          <div v-if="!quiz">
            <p class="text-red-600">Please complete all flashcards before attempting the quiz.</p>
            <button 
              @click="goToFlashcards" 
              class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Go to Flashcards
            </button>
          </div>

          <div v-else>
            <QuizCard
              v-for="(question, index) in quiz.questions"
              :key="question.id"
              :question="question"
              :index="index"
              @answer-submitted="handleAnswerSubmit"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Debug Information -->
    <div v-if="isDevelopment" class="mt-8">
      <LearningDebugComponent :debug-data="debugData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import QuizCard from '@/components/lessons/quiz/QuizCard.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const lessonsStore = useLessonsStore();
const isDevelopment = computed(() => import.meta.env.MODE === 'development');

// State
const loading = ref(true);
const error = ref<string | null>(null);
const timeSpent = ref(0);
const userAnswers = ref([]);
const quiz = ref(null);

// Computed
const levelId = computed(() => route.params.levelId as string);
const lessonId = computed(() => route.params.lessonId as string);
const formattedTimeSpent = computed(() => {
  const minutes = Math.floor(timeSpent.value / 60);
  const seconds = timeSpent.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  timeSpent: timeSpent.value,
  userAnswers: userAnswers.value,
  quiz: quiz.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error
  }
}));

const initializeQuiz = async () => {
  try {
    loading.value = true;
    error.value = null;
    await lessonsStore.getQuiz(levelId.value, lessonId.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load quiz. Please try again later.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const goToFlashcards = () => {
  router.push({
    name: 'flashcards',
    params: { levelId: levelId.value, lessonId: lessonId.value }
  });
};

const handleAnswerSubmit = async (questionId: string, answer: string) => {
  userAnswers.value.push({ questionId, answer });
  // Logic to handle answer submission and update progress can be added here
};

onMounted(() => {
  initializeQuiz();
});
</script>

<style scoped>
.quiz-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
