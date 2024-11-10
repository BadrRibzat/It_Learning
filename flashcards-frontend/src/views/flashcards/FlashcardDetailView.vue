<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="!flashcard.id" class="text-center py-8">
        <p class="text-gray-500">No flashcard found</p>
      </div>

      <div v-else class="bg-white p-8 rounded-lg shadow-lg">
        <!-- Flashcard Front/Back -->
        <div class="relative w-full h-96 perspective-1000 mb-8">
          <div
            class="absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d"
            :class="{ 'rotate-y-180': isFlipped }"
            @click="isFlipped = !isFlipped"
          >
            <!-- Front -->
            <div class="absolute w-full h-full bg-white rounded-lg shadow p-6 backface-hidden">
              <h2 class="text-2xl font-bold mb-4">{{ flashcard.word }}</h2>
              <p class="text-gray-700">{{ flashcard.definition }}</p>
              <p class="text-sm text-gray-500 mt-4">Click to flip</p>
            </div>

            <!-- Back -->
            <div class="absolute w-full h-full bg-white rounded-lg shadow p-6 backface-hidden rotate-y-180">
              <p class="text-xl font-semibold mb-4">{{ flashcard.question }}</p>
              <!-- Answer Form Section -->
  <div class="mt-6">
    <form @submit.prevent="submitAnswer" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Your Answer</label>
        <input
          v-model="userAnswer"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          :disabled="showingFeedback"
        />
      </div>

      <!-- Feedback Message -->
      <div v-if="showingFeedback" :class="feedbackClass" class="p-4 rounded-md">
        <p class="font-medium">{{ feedbackMessage }}</p>
        <button 
          v-if="!isCorrect"
          @click="resetAnswer"
          class="mt-2 px-4 py-2 bg-white text-gray-700 rounded border hover:bg-gray-50"
        >
          Try Again
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
        :disabled="showingFeedback || !userAnswer"
      >
        Submit Answer
      </button>
    </form>
  </div>

        <!-- Progress and Navigation -->
        <div class="flex justify-between items-center mt-6">
          <button
            @click="previousCard"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            :disabled="!hasPrevious"
          >
            Previous
          </button>
          <div class="text-center">
            <p class="text-lg font-semibold">{{ currentIndex + 1 }} / {{ totalCards }}</p>
            <p class="text-sm text-gray-600">Progress: {{ progress }}%</p>
          </div>
          <button
            @click="nextCard"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            :disabled="!hasNext"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import AnswerForm from '@/components/flashcards/AnswerForm.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const flashcard = ref({});
const isFlipped = ref(false);
const currentIndex = ref(0);
const flashcards = ref([]);
const totalCards = ref(0);

const progress = computed(() => {
  return Math.round((currentIndex.value / (totalCards.value - 1)) * 100);
});

const hasNext = computed(() => currentIndex.value < totalCards.value - 1);
const hasPrevious = computed(() => currentIndex.value > 0);

const loadFlashcard = async (id) => {
  try {
    await store.dispatch('flashcards/fetchFlashcard', id);
    flashcard.value = store.state.flashcards.currentFlashcard;
    isFlipped.value = false;
  } catch (error) {
    console.error('Error loading flashcard:', error);
  }
};

const nextCard = () => {
  if (hasNext.value) {
    currentIndex.value++;
    loadFlashcard(flashcards.value[currentIndex.value].id);
  }
};

const previousCard = () => {
  if (hasPrevious.value) {
    currentIndex.value--;
    loadFlashcard(flashcards.value[currentIndex.value].id);
  }
};

const handleAnswer = async (result) => {
  try {
    const response = await store.dispatch('flashcards/submitAnswer', {
      id: flashcard.value.id,
      answer: result.userAnswer
    });

    if (response.isCorrect) {
      // Real Time Update progress Tracking
      await store.dispatch('progress/updateFlashcardProgress', {
        flashcardId: flashcard.value.id,
        completed: true
      });

      // Automatically move to next card after short delay
      setTimeout(() => {
        if (hasNext.value) {
          nextCard();
        } else {
          // Complete lesson if all cards are done
          router.push('/dashboard/lessons');
        }
      }, 1500);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};

onMounted(async () => {
  try {
    // Load all flashcards for the current lesson
    const lessonId = route.query.lessonId;
    if (lessonId) {
      await store.dispatch('flashcards/fetchFlashcards', { lessonId });
      flashcards.value = store.state.flashcards.flashcards;
      totalCards.value = flashcards.value.length;

      // Load first flashcard
      if (flashcards.value.length > 0) {
        loadFlashcard(flashcards.value[0].id);
      }
    }
  } catch (error) {
    console.error('Error loading flashcards:', error);
  }
});

// Watch for route changes to reload flashcard
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadFlashcard(newId);
    }
  }
);
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
