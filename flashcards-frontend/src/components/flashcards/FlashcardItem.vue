<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ flashcard.word }}</h3>
    <p class="text-gray-700 mb-4">{{ flashcard.definition }}</p>
    <p class="text-gray-700 mb-4">{{ flashcard.question }}</p>
    <router-link :to="`/dashboard/flashcards/${flashcard.id}`" class="bg-primary text-white px-4 py-2 rounded-lg">View Flashcard</router-link>
  </div>
</template>

<script setup>
defineProps({
  flashcard: {
    type: Object,
    required: true,
  },
});
</script>
