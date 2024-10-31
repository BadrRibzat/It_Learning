<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{{ lesson.title }}</h1>
    <p class="text-gray-600 mb-6">{{ lesson.description }}</p>
    <button @click="showingFlashcards = true" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
      Start Flashcards
    </button>
    <div v-if="showingFlashcards">
      <FlashcardList :flashcards="flashcards" @complete="showingFlashcards = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import FlashcardList from '@/components/lessons/FlashcardList.vue';
import QuizList from '@/components/lessons/QuizList.vue';

const route = useRoute();
const store = useStore();
const lessonId = route.params.lessonId;
const lesson = ref({});
const flashcards = ref([]);
const quizzes = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    await store.dispatch('lessons/fetchLesson', lessonId);
    lesson.value = store.getters['lessons/currentLesson'];
    await store.dispatch('lessons/fetchFlashcards', lessonId);
    flashcards.value = store.getters['lessons/allFlashcards'];
    await store.dispatch('lessons/fetchQuizzes', lessonId);
    quizzes.value = store.getters['lessons/allQuizzes'];
  } catch (err) {
    error.value = 'Failed to load lesson data. Please try again.';
  } finally {
    loading.value = false;
  }
});
</script>
