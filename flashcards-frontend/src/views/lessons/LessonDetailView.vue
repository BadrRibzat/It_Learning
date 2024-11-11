<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Lesson Content -->
      <div v-else-if="lessonDetails">
        <div class="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 class="text-2xl font-bold mb-4">{{ lessonDetails.lesson.title }}</h2>
          <p class="text-gray-700 mb-4">{{ lessonDetails.lesson.content }}</p>
          
          <!-- Flashcards Section -->
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-4">Flashcards</h3>
            <button 
              @click="startFlashcards" 
              :disabled="!lessonDetails.flashcards.length"
              class="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Start Flashcards
            </button>
            <p v-if="!lessonDetails.flashcards.length" class="text-yellow-600 mt-2">
              No flashcards available for this lesson
            </p>
          </div>
        </div>

        <!-- Quizzes Section -->
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-4">Lesson Quizzes</h3>
          <div v-if="lessonDetails.quizzes.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuizCard 
              v-for="quiz in lessonDetails.quizzes" 
              :key="quiz.id" 
              :quiz="quiz" 
            />
          </div>
          <p v-else class="text-yellow-600">No quizzes available for this lesson</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import QuizCard from '@/components/quizzes/QuizCard.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

// State
const lessonDetails = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch lesson details
const fetchLessonDetails = async (lessonId) => {
  try {
    loading.value = true;
    error.value = null;

    const details = await store.dispatch('lessons/fetchLessonDetails', lessonId);
    lessonDetails.value = details;
  } catch (err) {
    error.value = 'Failed to load lesson content';
    store.dispatch('app/showNotification', {
      message: error.value,
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Start flashcards navigation
const startFlashcards = () => {
  if (lessonDetails.value?.flashcards?.length) {
    router.push({
      path: '/dashboard/flashcards',
      query: { lesson: lessonDetails.value.lesson.id }
    });
  } else {
    store.dispatch('app/showNotification', {
      message: 'No flashcards available for this lesson',
      type: 'warning'
    });
  }
};

// Lifecycle hook
onMounted(async () => {
  const lessonId = route.params.id;
  await fetchLessonDetails(lessonId);
});
</script>
