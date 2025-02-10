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
            :start-time="startTime"
            @time-update="handleTimeUpdate"
          />
        </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <QuickStat
        title="Quiz Progress"
        label="Questions"
        :value="currentQuestionIndex + 1"
        :total="totalQuestions"
        icon="ClipboardListIcon"
      />
      <QuickStat
        title="Time Remaining"
        label="Time"
        :value="timeSpent"
        suffix="s"
        icon="ClockIcon"
      />
      <QuickStat
        title="Current Score"
        label="Score"
        :value="currentScore"
        suffix="%"
        icon="ChartBarIcon"
      />
    </div>

        <div class="mt-4">
          <ProgressBar
            :value="currentQuestionIndex + 1"
            :max="totalQuestions"
            :show-percentage="true"
          />
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-if="!showResults && currentQuestion">
        <QuizQuestion
          :question="currentQuestion"
          :order="currentQuestionIndex + 1"
          :total="totalQuestions"
          :time-limit="questionTimeLimit"
          @submit="handleAnswerSubmit"
          @next="handleNext"
          @timeout="handleTimeout"
        />
      </div>

      <!-- Quiz Results -->
      <QuizResults
        v-else-if="showResults"
        :answers="userAnswers"
        :total-time="timeSpent"
        :passing-score="quiz?.passing_score || 80"
        @continue="handleContinue"
        @retry="handleRetry"
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
import type { Question, Quiz } from '@/types/lessons';
import {
  ClipboardListIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import QuizQuestion from '@/components/lessons/quiz/QuizQuestion.vue';
import QuizResults from '@/components/lessons/quiz/QuizResults.vue';
import LearningTimer from '@/components/lessons/common/LearningTimer.vue';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const lessonsStore = useLessonsStore();

// State
const loading = ref(true);
const error = ref<string | null>(null);
const startTime = ref(Date.now());
const currentQuestionIndex = ref(0);
const timeSpent = ref(0);
const userAnswers = ref<Array<{
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}>>([]);
const showResults = ref(false);
const questionTimeLimit = 60; // seconds per question

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const lessonId = computed(() => route.params.lessonId as string);
const quiz = computed(() => lessonsStore.currentQuiz);
const currentQuestion = computed(() => 
  quiz.value?.questions[currentQuestionIndex.value]
);
const totalQuestions = computed(() => quiz.value?.questions.length || 0);

const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  currentQuestion: currentQuestion.value,
  currentQuestionIndex: currentQuestionIndex.value,
  timeSpent: timeSpent.value,
  userAnswers: userAnswers.value,
  quiz: quiz.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error
  }
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

const handleAnswerSubmit = async (answer: string, questionTimeSpent: number) => {
  const question = currentQuestion.value;
  if (!question) return;

  const correctAnswer = lessonsStore.findFlashcardAnswer(
    question.command,
    lessonId.value
  );

  const isCorrect = correctAnswer ? 
    answer.trim().toLowerCase() === correctAnswer.toLowerCase() : 
    false;

  userAnswers.value.push({
    question: question.question,
    userAnswer: answer,
    correctAnswer: correctAnswer || 'Not available',
    isCorrect: isCorrect,
    timeSpent: questionTimeSpent
  });

  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    showResults.value = true;
    await submitQuiz();
  }
};

const getCorrectAnswer = async (questionId: string) => {
  try {
    const flashcard = lessonsStore.flashcards.find(f => 
      f.question === currentQuestion.value?.question
    );
    return flashcard?.answer || null;
  } catch (error) {
    console.error('Error getting correct answer:', error);
    return null;
  }
};

const handleNext = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++;
  }
};

const handleTimeout = () => {
  const question = currentQuestion.value;
  if (!question) return;

  userAnswers.value.push({
    question: question.question,
    userAnswer: 'No answer (time up)',
    correctAnswer: question.answer,
    isCorrect: false,
    timeSpent: questionTimeLimit
  });

  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    showResults.value = true;
    submitQuiz();
  } else {
    handleNext();
  }
};

const handleTimeUpdate = (seconds: number) => {
  timeSpent.value = seconds;
};

const submitQuiz = async () => {
  try {
    const correctAnswers = userAnswers.value.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions.value) * 100);

    await lessonsStore.submitQuizResults(lessonId.value, {
      answers: userAnswers.value,
      total_time: timeSpent.value,
      score: score,
      passed: score >= (quiz.value?.passing_score || 80)
    });

    toast.success('Quiz submitted successfully!');
  } catch (error) {
    toast.error('Failed to submit quiz results');
  }
};

const handleContinue = async () => {
  const correctAnswers = userAnswers.value.filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions.value) * 100);

  if (score >= (quiz.value?.passing_score || 80)) {
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

const handleRetry = async () => {
  try {
    // Reset quiz state
    currentQuestionIndex.value = 0;
    userAnswers.value = [];
    showResults.value = false;
    startTime.value = Date.now();
    timeSpent.value = 0;

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
      current_question: currentQuestionIndex.value,
      time_spent: timeSpent.value,
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
