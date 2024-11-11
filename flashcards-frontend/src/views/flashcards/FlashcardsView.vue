<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Flashcards</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Flashcards Content -->
      <div v-else-if="filteredFlashcards.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FlashcardItem 
          v-for="flashcard in filteredFlashcards" 
          :key="flashcard.id" 
          :flashcard="flashcard" 
        />
      </div>

      <!-- No Flashcards -->
      <div v-else class="text-center text-gray-500 py-8">
        No flashcards available for this lesson
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import FlashcardItem from '@/components/flashcards/FlashcardItem.vue';

// Store and Route
const store = useStore();
const route = useRoute();

// State management
const flashcards = ref([]);
const loading = ref(true);
const error = ref(null);

// Computed Properties
const currentLesson = computed(() => store.state.lessons.currentLesson);

const filteredFlashcards = computed(() => {
  const lessonId = route.query.lesson || (currentLesson.value?.id);
  if (lessonId) {
    return flashcards.value.filter(flashcard => 
      flashcard.lesson === parseInt(lessonId)
    );
  }
  return [];
});

// Fetch Flashcards Method
const fetchFlashcards = async (lessonId) => {
  try {
    loading.value = true;
    error.value = null;

    // Use the new service method to fetch flashcards
    const response = await store.dispatch('flashcards/fetchFlashcards', { 
      lessonId, 
      includeDetails: true 
    });
    
    flashcards.value = response.data || [];

    // Show notification if no flashcards
    if (flashcards.value.length === 0) {
      store.dispatch('app/showNotification', {
        message: 'No flashcards available for this lesson',
        type: 'warning'
      });
    }
  } catch (error) {
    error.value = 'Failed to load flashcards';
    store.dispatch('app/showNotification', {
      message: error.value,
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hook
onMounted(async () => {
  const lessonId = route.query.lesson || (currentLesson.value?.id);
  
  if (lessonId) {
    await fetchFlashcards(lessonId);
  } else {
    // If no lesson is specified, show a warning
    store.dispatch('app/showNotification', {
      message: 'No lesson selected for flashcards',
      type: 'warning'
    });
    loading.value = false;
  }
});
</script>
