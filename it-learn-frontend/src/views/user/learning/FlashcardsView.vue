<template>
  <div class="flashcards-view space-y-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeFlashcards" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <div class="max-w-3xl mx-auto">
        <!-- Learning Timer -->
        <div class="mb-4 flex justify-end">
          <LearningTimer
            :start-time="startTime"
            @time-update="handleTimeUpdate"
          />
        </div>

        <!-- Flashcard Progress -->
        <div class="mb-6">
          <FlashcardProgress
            title="Flashcard Progress"
            :current-index="currentIndex"
            :total="totalFlashcards"
            :correct-answers="correctAnswers"
            :points="totalPoints"
            :answered-cards="answeredCards"
          />
        </div>

        <!-- Current Flashcard -->
        <div class="flashcard-container bg-white rounded-lg shadow-lg">
          <FlashcardCard
            v-if="currentFlashcard"
            :flashcard="currentFlashcard"
            @answer-submitted="handleAnswerSubmit"
            @next="handleNext"
          >
            <template #front>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ currentFlashcard.command }}
                </h3>
                <p class="text-gray-700">
                  {{ currentFlashcard.explanation }}
                </p>
                <CommandExample
                  :command="currentFlashcard.command"
                  :output="currentFlashcard.formatted_example"
                  :description="currentFlashcard.example"
                  :can-copy="true"
                />
              </div>
            </template>
          </FlashcardCard>
        </div>

        <!-- Navigation and Progress -->
        <div class="mt-6 flex items-center justify-between">
          <button
            v-if="currentIndex > 0"
            @click="navigateToPrevious"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span class="flex items-center">
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              Previous Card
            </span>
          </button>
          <div class="flex-1" />
          <div v-if="isLastCard && allCorrect" class="text-center">
            <button
              @click="completeLesson"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Lesson
            </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import { useToast } from 'vue-toastification';
import { 
    ArrowLeftIcon,
    ClipboardListIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/vue/24/outline';
import type { Flashcard } from '@/types/lessons';

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import FlashcardCard from '@/components/lessons/flashcards/FlashcardCard.vue';
import FlashcardProgress from '@/components/lessons/flashcards/FlashcardProgress.vue';
import FlashcardQuestion from '@/components/lessons/flashcards/FlashcardQuestion.vue';
import CommandExample from '@/components/lessons/common/CommandExample.vue';
import LearningTimer from '@/components/lessons/common/LearningTimer.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const lessonsStore = useLessonsStore();
const allCardsCompleted = computed(() => correctAnswers.value === totalFlashcards.value);

// State
const loading = ref(true);
const error = ref<string | null>(null);
const currentIndex = ref(0);
const startTime = ref(Date.now());
const correctAnswers = ref(0);
const totalPoints = ref(0);
const answeredCards = ref<boolean[]>([]);
const timeSpent = ref(0);

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const lessonId = computed(() => route.params.lessonId as string);
const currentFlashcard = computed(() => lessonsStore.flashcards[currentIndex.value]);
const totalFlashcards = computed(() => lessonsStore.flashcards.length);
const isLastCard = computed(() => currentIndex.value === totalFlashcards.value - 1);
const allCorrect = computed(() => correctAnswers.value === totalFlashcards.value);

// Initialize flashcards
const initializeFlashcards = async () => {
  try {
    loading.value = true;
    error.value = null;
    await lessonsStore.fetchFlashcards(lessonId.value);
    answeredCards.value = new Array(lessonsStore.flashcards.length).fill(false);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load flashcards';
    toast.error('Failed to load flashcards');
  } finally {
    loading.value = false;
  }
};

const navigateToPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// Handle answer submission
const handleAnswerSubmit = async (answer: string) => {
  try {
    const isCorrect = answer.trim().toLowerCase() === currentFlashcard.value?.answer.toLowerCase();
    
    if (isCorrect) {
      correctAnswers.value++;
      totalPoints.value += 10;
      answeredCards.value[currentIndex.value] = true;

      const response = await lessonsStore.submitFlashcardAnswer(lessonId.value, {
        flashcard_id: currentFlashcard.value.id,
        user_answer: answer,
        expected_answer: currentFlashcard.value.answer,
        time_spent: timeSpent.value
      });

      console.log('Flashcard answer submission response:', response);

      if (isLastCard.value && allCardsCompleted.value) {
        await completeLesson();
      }

      toast.success('Correct answer! +10 points');
    } else {
      toast.error('Incorrect answer. Try again!');
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    toast.error('Failed to submit answer');
  }
};

// Handle next flashcard
const handleNext = () => {
  if (currentIndex.value < totalFlashcards.value - 1) {
    currentIndex.value++;
  }
};

const completeLesson = async () => {
  try {
    await lessonsStore.completeLesson(lessonId.value);
    toast.success('Lesson completed! Quiz unlocked!');
    router.push({
      name: 'quiz',
      params: { levelId: levelId.value, lessonId: lessonId.value }
    });
  } catch (error) {
    toast.error('Failed to complete lesson');
  }
};

// Handle time updates
const handleTimeUpdate = (seconds: number) => {
  timeSpent.value = seconds;
};

// Debug data
const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  currentFlashcard: currentFlashcard.value,
  currentIndex: currentIndex.value,
  correctAnswers: correctAnswers.value,
  totalPoints: totalPoints.value,
  timeSpent: timeSpent.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error,
    flashcardsCount: lessonsStore.flashcards.length
  }
}));

// Lifecycle hooks
onMounted(() => {
  initializeFlashcards();
});

onUnmounted(() => {
  if (correctAnswers.value > 0) {
    lessonsStore.saveProgress(lessonId.value, {
      completed_flashcards: correctAnswers.value,
      total_points: totalPoints.value,
      time_spent: timeSpent.value
    }).catch(console.error);
  }
});
</script>

<style scoped>
.flashcards-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
