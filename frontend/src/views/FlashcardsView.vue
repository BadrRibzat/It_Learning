<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("flashcards.title") }}</h1>
    <div v-if="flashcards.length">
      <BaseCard
        v-for="flashcard in flashcards"
        :key="flashcard.id"
        class="mb-4"
      >
        <h2 class="text-xl font-bold">{{ flashcard.word }}</h2>
        <p>{{ flashcard.definition }}</p>
      </BaseCard>
    </div>
    <p v-else>{{ $t("flashcards.noFlashcards") }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseCard from "@/components/base/BaseCard.vue";
import api from "@/api";

const flashcards = ref([]);

onMounted(async () => {
  try {
    const response = await api.get("/flashcards/");
    flashcards.value = response.data;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
  }
});
</script>
