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
                  :output="currentFlashcard.formatted_example || ''"
                  :description="currentFlashcard.example"
                  :can-copy="true"
                />
              </div>
            </template>
          </FlashcardCard>
        </div>

        <!-- Quiz Access -->
        <div class="mt-6 text-center">
          <button
            @click="goToQuiz"
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Quiz
          </button>
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
import { useLessonsStore } from "@/stores/lessons";
import { useToast } from "vue-toastification";
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import FlashcardCard from "@/components/lessons/flashcards/FlashcardCard.vue";
import ProgressBar from "@/components/lessons/common/ProgressBar.vue";
import CommandExample from "@/components/lessons/common/CommandExample.vue";
import LearningTimer from "@/components/lessons/common/LearningTimer.vue";
import LearningDebugComponent from './LearningDebugComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const lessonsStore = useLessonsStore();
const isDevelopment = computed(() => import.meta.env.MODE === 'development');

// State
const loading = ref(true);
const error = ref<string | null>(null);
const currentIndex = ref(0);

// Computed
const levelId = computed(() => route.params['levelId'] as string);
const lessonId = computed(() => route.params['lessonId'] as string);
const currentFlashcard = computed(() => lessonsStore.flashcards[currentIndex.value]);
const totalFlashcards = computed(() => lessonsStore.flashcards.length);

const initializeFlashcards = async () => {
  try {
    loading.value = true;
    error.value = null;
    await lessonsStore.getFlashcards(lessonId.value);
  } catch (err) {
    error.value = err instanceof Error ? `Error: ${err.message}` : 'Failed to load flashcards. Please try again later.';
    toast.error(error.value);
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
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer. Try again!');
    }
  } catch (error) {
    console.error('Error processing answer:', error);
    toast.error('Error processing answer.');
  }
};

// Handle next flashcard
const handleNext = () => {
  if (currentIndex.value < totalFlashcards.value - 1) {
    currentIndex.value++;
  }
};

const goToQuiz = async () => {
  try {
    // Load quiz directly without store method
    const response = await fetch(`/api/levels/${levelId.value}/lessons/${lessonId.value}/quiz`);
    if (!response.ok) throw new Error('Failed to fetch quiz');
    lessonsStore.currentQuiz = await response.json();
    router.push({
      name: 'quiz',
      params: { levelId: levelId.value, lessonId: lessonId.value }
    });
  } catch (error) {
    toast.error('Failed to load quiz');
  }
};


// Debug data
const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  currentFlashcard: currentFlashcard.value,
  currentIndex: currentIndex.value,
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

</script>

<style scoped>
.flashcards-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
