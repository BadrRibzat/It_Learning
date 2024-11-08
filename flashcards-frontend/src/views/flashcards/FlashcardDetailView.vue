<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Flashcard Detail</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">{{ flashcard.word }}</h2>
        <p class="text-gray-700 mb-4">{{ flashcard.definition }}</p>
        <p class="text-gray-700 mb-4">{{ flashcard.question }}</p>
        <AnswerForm :flashcardId="flashcard.id" :correctAnswer="flashcard.word" @answer-submitted="handleAnswer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import AnswerForm from '@/components/flashcards/AnswerForm.vue';

const store = useStore();
const route = useRoute();
const flashcard = ref({});

onMounted(async () => {
  const flashcardId = route.params.id;
  await store.dispatch('flashcards/fetchFlashcard', flashcardId);
  flashcard.value = store.state.flashcards.currentFlashcard;
});

const handleAnswer = async (result) => {
  try {
    const response = await store.dispatch('flashcards/submitAnswer', { id: flashcard.value.id, answer: result.userAnswer });
    console.log('Answer submitted:', response);
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};
</script>
