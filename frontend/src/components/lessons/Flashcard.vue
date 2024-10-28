<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="text-center">
      <h3 class="text-xl font-bold mb-2">{{ flashcard.question }}</h3>
      <p class="text-gray-600">{{ flashcard.answer }}</p>
    </div>
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
