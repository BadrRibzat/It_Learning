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
      <!-- Quiz Progress Header -->
      <div v-if="!showResults" class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            Lesson Quiz
          </h2>
          <LearningTimer
            :total-time="quizTimeLimit"
            @time-update="handleTimeUpdate"
            @time-expired="submitQuiz"
          />
        </div>
      </div>
      <!-- Quiz Content -->
      <div v-if="!showResults && quiz?.questions && areFlashcardsCompleted">
        <QuizQuestion
          :questions="quiz.questions"
          :time-limit="quizTimeLimit"
          @submit="handleQuizSubmit"
        />
        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            @click="submitQuiz"
          >
            Submit Quiz
          </button>
        </div>
      </div>
      <div v-else-if="!areFlashcardsCompleted" class="text-center py-8">
        <p class="text-gray-600">
          Please complete all flashcards before attempting the quiz.
        </p>
        <button
          @click="goToFlashcards"
          class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go to Flashcards
        </button>
      </div>

      <!-- Quiz Results -->
      <QuizResults
        v-else-if="showResults"
        :results="quizResults"
        @retry="handleRetry"
        @continue="handleContinue"
      />
    </template>

    <!-- Debug Information -->
    <div v-if="isDevelopment" class="mt-8">
      <LearningDebugComponent :debug-data="debugData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import { useToast } from 'vue-toastification';
import type { Quiz } from '@/types/lessons';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import QuizQuestion from '@/components/lessons/quiz/QuizQuestion.vue';
import QuizResults from '@/components/lessons/quiz/QuizResults.vue';
import LearningTimer from '@/components/lessons/common/LearningTimer.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const lessonsStore = useLessonsStore();
const toast = useToast();

import type { QuizSubmissionResponse } from '@/types/lessons';

// Computed
const quizResults = computed<QuizSubmissionResponse>(() => {
  const correctAnswersCount = userAnswers.value.filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswersCount / totalQuestions.value) * 100);

  return {
    score: score,
    correct_answers: correctAnswersCount,
    total_questions: totalQuestions.value,
    passed: score >= 80,
    next_lesson_unlocked: false, // This value will be updated after submitting the quiz
    points_earned: 0, // This value will be updated after submitting the quiz
    quiz_completed: false, // This value will be updated after submitting the quiz
    quiz_score: score, // This value will be updated after submitting the quiz
    questions_with_answers: [] // This value will be updated after submitting the quiz
  };
});

// Refs
const loading = ref(false);
const error = ref<string | null>(null);
const quizTimeLimit = 300; // 5 minutes
const timeSpent = ref(quizTimeLimit);
const userAnswers = ref<
  Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>
>([]);
const showResults = ref(false);

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const lessonId = computed(() => route.params.lessonId as string);
const quiz = computed(() => lessonsStore.currentQuiz);
const totalQuestions = computed(() => quiz.value?.questions.length || 0);

const areFlashcardsCompleted = computed(() => {
  const lesson = lessonsStore.currentLesson;
  if (!lesson) return false;
  return lesson.progress.completed_flashcards === lesson.progress.total_flashcards;
});

const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  timeSpent: timeSpent.value,
  userAnswers: userAnswers.value,
  quiz: quiz.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error,
  },
}));

// Methods
const initializeQuiz = async () => {
  try {
    loading.value = true;
    error.value = null;
    await lessonsStore.fetchQuiz(lessonId.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load quiz';
    toast.error('Failed to load quiz');
  } finally {
    loading.value = false;
  }
};

const handleQuizSubmit = (answers: string[]) => {
  if (!quiz.value) return;

  // Clear previous answers
  userAnswers.value = [];

  quiz.value.questions.forEach((question, index) => {
    const correctAnswer = lessonsStore.findFlashcardAnswer(
      question.command,
      lessonId.value
    );

    const isCorrect = correctAnswer ?
      answers[index]?.trim().toLowerCase() === correctAnswer.toLowerCase() :
      false;

    userAnswers.value.push({
      question: question.question,
      userAnswer: answers[index] || 'No answer provided',
      correctAnswer: correctAnswer || 'Not available',
      isCorrect: isCorrect,
      timeSpent: 0 // Time spent is not tracked anymore
    });
  });

  showResults.value = true;
};

const handleTimeUpdate = (seconds: number) => {
  timeSpent.value = seconds;
};

const submitQuiz = async () => {
  try {
    if (!quiz.value) return;
    const correctAnswers = userAnswers.value.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions.value) * 100);

    await lessonsStore.submitQuizResults(lessonId.value, {
      answers: userAnswers.value,
      total_time: quizTimeLimit - timeSpent.value,
      score: score,
      passed: score >= 80, // Assuming 80% is the passing score
    });

    toast.success('Quiz submitted successfully!');
  } catch (error) {
    toast.error('Failed to submit quiz results');
  } finally {
    showResults.value = true;
  }
};

const handleContinue = async () => {
  if (!quiz.value) return;

  if (!areFlashcardsCompleted.value) {
    router.push({
      name: 'flashcards',
      params: {
        levelId: levelId.value,
        lessonId: lessonId.value,
      },
    });
  } else {
    try {
      await lessonsStore.completeLesson(lessonId.value);
      toast.success('Lesson completed successfully!');

      // Navigate back to level view
      router.push({
        name: 'level',
        params: { levelId: levelId.value }
      });
    } catch (error) {
      toast.error('Failed to complete lesson');
    }
  }
};

const goToFlashcards = () => {
  router.push({
    name: 'flashcards',
    params: {
      levelId: levelId.value,
      lessonId: lessonId.value,
    },
  });
};

const handleRetry = async () => {
  try {
    // Reset quiz state
    userAnswers.value = [];
    showResults.value = false;
    timeSpent.value = quizTimeLimit;

    // Fetch fresh quiz questions
    await initializeQuiz();

    toast.info('Starting quiz again...');
  } catch (error) {
    toast.error('Failed to restart quiz');
  }
};

// Lifecycle hooks
onMounted(() => {
  initializeQuiz();
});

// Cleanup function if needed
onBeforeUnmount(() => {
  // Save any necessary state or cleanup timers
  if (timeSpent.value > 0 && !showResults.value) {
    lessonsStore.saveQuizProgress(lessonId.value, {
      current_question: 0,
      time_spent: quizTimeLimit - timeSpent.value,
      answers: userAnswers.value
    }).catch(console.error);
  }
});
</script>

<style scoped>
.quiz-view {
  max-width: 800px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>