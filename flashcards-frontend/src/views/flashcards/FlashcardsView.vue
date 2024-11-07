<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Flashcards</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FlashcardItem v-for="flashcard in flashcards" :key="flashcard.id" :flashcard="flashcard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import FlashcardItem from '@/components/flashcards/FlashcardItem.vue';

const store = useStore();
const flashcards = ref([]);

onMounted(async () => {
  await store.dispatch('flashcards/fetchFlashcards');
  flashcards.value = store.state.flashcards.flashcards;
});
</script>
