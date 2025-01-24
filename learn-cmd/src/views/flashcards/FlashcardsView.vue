<template>
  <div class="page-container p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">
      Flashcards
    </h1>
    <FlashcardDetail />
  </div>
</template>

<script>
import FlashcardDetail from "@/components/flashcards/FlashcardDetail.vue";

export default {
  name: "FlashcardsView",
  components: {
    FlashcardDetail,
  },
};
</script>
