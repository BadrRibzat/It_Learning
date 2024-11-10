<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Flashcards</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FlashcardItem v-for="flashcard in filteredFlashcards" :key="flashcard.id" :flashcard="flashcard" />
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

const store = useStore();
const route = useRoute();
const flashcards = ref([]);
const loading = ref(true);
const error = ref(null);

const currentLesson = computed(() => store.state.lessons.currentLesson);

const filteredFlashcards = computed(() => {
  const lessonId = route.query.lesson || (currentLesson.value?.id);
  if (lessonId) {
    return flashcards.value.filter(flashcard => flashcard.lesson.id === parseInt(lessonId));
  }
  return [];
});

onMounted(async () => {
  try {
    const lessonId = route.query.lesson || (currentLesson.value?.id);
    if (lessonId) {
      await store.dispatch('flashcards/fetchFlashcards', { lessonId });
      flashcards.value = store.state.flashcards.flashcards;
    }
  } catch (error) {
    console.error('Error loading flashcards:', error);
  } finally {
    loading.value = false;
  }
});
</script>
