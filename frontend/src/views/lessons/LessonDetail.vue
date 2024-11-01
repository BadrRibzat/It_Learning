<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{{ lesson.title }}</h1>
    <p class="text-gray-600 mb-6">{{ lesson.content }}</p>
    <button @click="startFlashcards" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
      Start Flashcards
    </button>
    <div v-if="showingFlashcards">
      <FlashcardList :flashcards="flashcards" @complete="completeFlashcards" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import FlashcardList from '@/components/lessons/FlashcardList.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const lesson = ref({});
const flashcards = ref([]);
const showingFlashcards = ref(false);

onMounted(async () => {
  try {
    await store.dispatch('lessons/fetchLesson', route.params.lessonId);
    lesson.value = store.getters['lessons/currentLesson'];
    await store.dispatch('lessons/fetchFlashcards', route.params.lessonId);
    flashcards.value = store.getters['lessons/allFlashcards'];
  } catch (error) {
    console.error('Error fetching lesson data:', error);
  }
});

const startFlashcards = () => {
  showingFlashcards.value = true;
};

const completeFlashcards = async () => {
  showingFlashcards.value = false;
  await store.dispatch('lessons/updateCurrentLesson', lesson.value.id);
  router.push({ name: 'LessonsList' });
};
</script>
