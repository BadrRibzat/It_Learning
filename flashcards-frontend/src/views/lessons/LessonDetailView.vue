<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>

      <div v-else>
        <!-- Lesson Content -->
        <div class="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 class="text-2xl font-bold mb-4">{{ lesson.title }}</h2>
          <p class="text-gray-700 mb-4">{{ lesson.content }}</p>
          
          <!-- Flashcards Section -->
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-4">Flashcards</h3>
            <button 
              @click="startFlashcards" 
              class="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Start Flashcards
            </button>
          </div>
        </div>

        <!-- Quizzes Section -->
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-4">Lesson Quizzes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuizCard 
              v-for="quiz in quizzes" 
              :key="quiz.id" 
              :quiz="quiz" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import QuizCard from '@/components/quizzes/QuizCard.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
const lesson = ref({});
const quizzes = ref([]);
const flashcards = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchLessonData = async (lessonId) => {
  try {
    loading.value = true;
    error.value = null;

    const [lessonResponse, quizzesResponse, flashcardsResponse] = await Promise.all([
      store.dispatch('lessons/fetchLesson', lessonId),
      store.dispatch('quizzes/fetchQuizzes', lessonId),
      store.dispatch('flashcards/fetchFlashcards', lessonId)
    ]);

    lesson.value = lessonResponse.data;
    quizzes.value = quizzesResponse.data;
    flashcards.value = flashcardsResponse.data;
  } catch (err) {
    error.value = 'Failed to load lesson content';
    console.error('Error loading lesson:', err);
  } finally {
    loading.value = false;
  }
};

const startFlashcards = () => {
  if (flashcards.value.length > 0) {
    router.push({
      path: '/dashboard/flashcards',
      query: { lesson: lesson.value.id }
    });
  } else {
    store.dispatch('app/showNotification', {
      message: 'No flashcards available for this lesson',
      type: 'warning'
    });
  }
};

onMounted(async () => {
  const lessonId = route.params.id;
  await fetchLessonData(lessonId);
});
</script>
