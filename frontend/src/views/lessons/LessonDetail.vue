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
import { lessonService } from '@/api/services/lessons';
import FlashcardList from '@/components/lessons/FlashcardList.vue';

const route = useRoute();
const lessonId = route.params.lessonId;
const lesson = ref({});
const flashcards = ref([]);
const showingFlashcards = ref(false);

onMounted(async () => {
  try {
    const { data } = await lessonService.getLesson(lessonId);
    lesson.value = data;
    const { data: flashcardData } = await lessonService.getFlashcards(lessonId);
    flashcards.value = flashcardData;
  } catch (error) {
    console.error('Error fetching lesson data:', error);
  }
});
</script>
