<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("flashcards.title") }}</h1>
    <div v-if="flashcards.length">
      <Flashcard
        v-for="flashcard in flashcards"
        :key="flashcard.id"
        :flashcard="flashcard"
        @answer="handleAnswer"
        class="mb-4"
      />
    </div>
    <p v-else>{{ $t("flashcards.noFlashcards") }}</p>
    <div v-if="feedback" class="mt-4 p-4 rounded" :class="feedbackClass">
      {{ feedback }}
    </div>
    <BaseButton v-if="showNextButton" @click="nextFlashcard" class="mt-4">
      {{ $t("flashcards.next") }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import FlashcardComponent from "@/components/FlashcardComponent.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import api from "@/api";
import { key } from "@/store";

const store = useStore(key);
const flashcards = ref<any[]>([]);
const currentFlashcardIndex = ref(0);
const feedback = ref("");
const showNextButton = ref(false);

const currentFlashcard = computed(() => flashcards.value[currentFlashcardIndex.value]);

const feedbackClass = computed(() => {
  return feedback.value.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
});

onMounted(async () => {
  try {
    const response = await api.get("/flashcards/");
    flashcards.value = response.data;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
  }
});

const handleAnswer = async ({ flashcardId, userAnswer }: { flashcardId: number; userAnswer: string }) => {
  try {
    const response = await api.post(`/flashcard-submit/${flashcardId}/`, { answer: userAnswer });
    feedback.value = response.data.is_correct
      ? "Correct answer!"
      : "Incorrect answer. Try again!";
    showNextButton.value = response.data.is_correct;
    
    if (response.data.is_correct) {
      await store.dispatch("progress/updateUserProgress", {
        lessonId: currentFlashcard.value.lesson,
        completed: response.data.lesson_completed,
        correctAnswers: 1,
        totalQuestions: 1,
      });
    }
  } catch (error) {
    console.error("Error submitting flashcard answer:", error);
    feedback.value = "Error submitting answer. Please try again.";
  }
};

const nextFlashcard = () => {
  currentFlashcardIndex.value++;
  if (currentFlashcardIndex.value >= flashcards.value.length) {
    currentFlashcardIndex.value = 0;
  }
  feedback.value = "";
  showNextButton.value = false;
};
</script>
