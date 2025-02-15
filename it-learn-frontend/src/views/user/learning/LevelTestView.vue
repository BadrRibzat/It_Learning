<template>
  <div class="level-test-view space-y-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeTest" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <!-- Test Header -->
      <div v-if="!showResults" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Level {{ currentLevel?.order }} Test
            </h2>
            <p class="text-gray-600 mt-1">
              Pass this test to advance to the next level
            </p>
          </div>
          <LearningTimer
            :total-time="timeSpent"
            @time-update="handleTimeUpdate"
          />
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <QuickStat
            title="Questions Completed"
            label="Questions"
            :value="currentQuestionIndex + 1"
            :total="totalQuestions"
            icon="ClipboardListIcon"
          />
          <QuickStat
            title="Time Spent"
            label="Time"
            :value="timeSpent"
            suffix="s"
            icon="ClockIcon"
          />
          <QuickStat
            title="Score"
            label="Current Score"
            :value="currentScore"
            suffix="%"
            icon="ChartBarIcon"
          />
        </div>

        <ProgressBar
          :value="currentQuestionIndex + 1"
          :max="totalQuestions"
          :show-percentage="true"
        />
      </div>

      <!-- Test Question -->
      <div v-if="!showResults && currentQuestion">
        <LevelTestQuestion
          :question="currentQuestion"
          :order="currentQuestionIndex + 1"
          :total="totalQuestions"
          :time-limit="questionTimeLimit"
          @submit="handleAnswerSubmit"
          @next="handleNext"
          @timeout="handleTimeout"
        />
      </div>

      <!-- Test Results -->
      <LevelTestResults
        v-else-if="showResults"
        :answers="userAnswers"
        :total-time="timeSpent"
        :passing-score="levelTest?.passing_score || 80"
        :achievements="unlockedAchievements"
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LevelTestQuestion from '@/components/lessons/level/LevelTestQuestion.vue';
import LevelTestResults from '@/components/lessons/level/LevelTestResults.vue';
import LearningTimer from '@/components/lessons/common/LearningTimer.vue';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = useLessonsStore();
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
  points: number;
}>>([]);
const showResults = ref(false);
const questionTimeLimit = 90;

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const currentLevel = computed(() => store.currentLevel);
const levelTest = computed(() => store.levelTest);
const currentQuestion = computed(() =>
  levelTest.value?.questions[currentQuestionIndex.value]
);
const totalQuestions = computed(() => levelTest.value?.questions.length || 0);

const currentScore = computed(() => {
  const totalPoints = userAnswers.value.reduce((sum, a) => sum + a.points, 0);
  return Math.round((totalPoints / (totalQuestions.value * 100)) * 100);
});

const unlockedAchievements = computed(() => {
  const achievements = [];
  const correctAnswers = userAnswers.value.filter(a => a.isCorrect).length;
  const totalPoints = userAnswers.value.reduce((sum, a) => sum + a.points, 0);

  if (totalPoints >= totalQuestions.value * 90) {
    achievements.push({
      id: 'perfect',
      name: 'Perfect Score',
      description: 'Scored over 90% on the level test',
      icon: '🏆'
    });
  }

  if (timeSpent.value < totalQuestions.value * 45) {
    achievements.push({
      id: 'speed',
      name: 'Speed Demon',
      description: 'Completed the test in record time',
      icon: '⚡'
    });
  }

  if (correctAnswers === totalQuestions.value) {
    achievements.push({
      id: 'flawless',
      name: 'Flawless Victory',
      description: 'Answered all questions correctly',
      icon: '✨'
    });
  }

  return achievements;
});

const debugData = computed(() => ({
  levelId: levelId.value,
  currentLevel: currentLevel.value,
  currentQuestion: currentQuestion.value,
  currentQuestionIndex: currentQuestionIndex.value,
  timeSpent: timeSpent.value,
  userAnswers: userAnswers.value,
  levelTest: levelTest.value,
  unlockedAchievements: unlockedAchievements.value,
  storeState: {
    loading: store.loading,
    error: store.error
  }
}));

const initializeTest = async () => {
  try {
    loading.value = true;
    error.value = null;

    await Promise.all([
      store.getLevels(),
      store.getLevelTest(levelId.value)
    ]);

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load level test';
    toast.error('Failed to load level test');
  } finally {
    loading.value = false;
  }
};

const handleAnswerSubmit = (answer: string, questionTimeSpent: number, points: number) => {
  const question = currentQuestion.value;
  if (!question) return;

  userAnswers.value.push({
    question: question.question,
    userAnswer: answer,
    correctAnswer: question.answer,
    isCorrect: answer.trim().toLowerCase() === question.answer.toLowerCase(),
    timeSpent: questionTimeSpent,
    points: points
  });

  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    showResults.value = true;
    submitTestResults();
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
    timeSpent: questionTimeLimit,
    points: 0
  });

  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    showResults.value = true;
    submitTestResults();
  } else {
    handleNext();
  }
};

const handleTimeUpdate = (seconds: number) => {
  timeSpent.value = seconds;
};

const submitTestResults = async () => {
  try {
    const correctAnswers = userAnswers.value.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions.value) * 100);
    const passed = score >= (levelTest.value?.passing_score || 80);

    await store.submitLevelTest(levelId.value, {
      answers: userAnswers.value.map(a => a.userAnswer)
    });

    if (passed) {
      toast.success(`Congratulations! You've passed with ${score}%!`);
    } else {
      toast.info('Keep practicing and try again!');
    }
  } catch (error) {
    toast.error('Failed to submit test results');
  }
};

const handleContinue = async () => {
  const totalPoints = userAnswers.value.reduce((sum, a) => sum + a.points, 0);
  const score = Math.round((totalPoints / (totalQuestions.value * 100)) * 100);
  const passingScore = levelTest.value?.passing_score || 80;

  if (score >= passingScore) {
    try {
      await store.advanceToNextLevel(levelId.value);
      router.push({ name: 'profile' });
    } catch (error) {
      toast.error('Failed to advance to next level');
    }
  } else {
    router.push({
      name: 'level',
      params: { levelId: levelId.value }
    });
  }
};

onMounted(() => {
  initializeTest();
});

onBeforeUnmount(() => {
  // Clean up or save progress if needed
  if (timeSpent.value > 0 && !showResults.value) {
    store.saveLevelTestProgress(levelId.value, {
      current_question: currentQuestionIndex.value,
      time_spent: timeSpent.value,
      answers: userAnswers.value
    }).catch(console.error);
  }
});
</script>

<style scoped>
.level-test-view {
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
