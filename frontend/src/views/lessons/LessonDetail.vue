<template>
  <div class="container mx-auto p-4">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h1 class="text-3xl font-bold mb-4">{{ lesson.title }}</h1>
      <p class="text-gray-600 mb-6">{{ lesson.description }}</p>
      
      <h2 class="text-2xl font-bold mb-4">Flashcards</h2>
      <button @click="showingFlashcards = true" class="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
        Start Flashcards
      </button>
      <div v-if="showingFlashcards">
        <FlashcardList :flashcards="flashcards" @complete="showingFlashcards = false" />
      </div>

      <div v-if="quiz">
        <h2 class="text-2xl font-bold mb-4">Quiz</h2>
        <QuizCard :quiz="quiz" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import FlashcardList from '@/components/lessons/FlashcardList.vue';
import QuizCard from '@/components/lessons/QuizCard.vue';

const route = useRoute();
const store = useStore();
const lessonId = route.params.lessonId;
const lesson = ref({});
const flashcards = ref([]);
const quiz = ref(null);
const loading = ref(true);
const error = ref(null);
const showingFlashcards = ref(false);

onMounted(async () => {
  try {
    await store.dispatch('lessons/fetchLesson', lessonId);
    lesson.value = store.getters['lessons/currentLesson'];
    await store.dispatch('lessons/fetchFlashcards', lessonId);
    flashcards.value = store.getters['lessons/allFlashcards'];
    await store.dispatch('lessons/fetchQuiz', lessonId);
    quiz.value = store.getters['lessons/currentQuiz'];
  } catch (err) {
    error.value = 'Failed to load lesson data. Please try again.';
  } finally {
    loading.value = false;
  }
});
</script>
