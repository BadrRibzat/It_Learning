<template>
  <div class="flashcard-container" @click="flipCard">
    <div class="flashcard" :class="{ 'is-flipped': isFlipped }">
      <div class="flashcard-front">
        <h3 class="text-xl font-bold mb-2">{{ flashcard.word }}</h3>
        <p>{{ flashcard.definition }}</p>
      </div>
      <div class="flashcard-back">
        <h3 class="text-xl font-bold mb-2">{{ flashcard.question }}</h3>
        <BaseInput
          v-model="userAnswer"
          :placeholder="$t('flashcard.answerPlaceholder')"
        />
        <BaseButton @click.stop="submitAnswer" :disabled="!userAnswer">
          {{ $t("flashcard.submit") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const props = defineProps<{
  flashcard: {
    id: number;
    word: string;
    definition: string;
    question: string;
  };
}>();

const emit = defineEmits<{
  (e: "answer", payload: { flashcardId: number; userAnswer: string }): void;
}>();

const isFlipped = ref(false);
const userAnswer = ref("");

const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

const submitAnswer = () => {
  emit("answer", {
    flashcardId: props.flashcard.id,
    userAnswer: userAnswer.value,
  });
  userAnswer.value = "";
  isFlipped.value = false;
};
</script>

<style scoped>
.flashcard-container {
  perspective: 1000px;
}

.flashcard {
  width: 100%;
  height: 200px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flashcard-front {
  background-color: #f0f0f0;
}

.flashcard-back {
  background-color: #e0e0e0;
  transform: rotateY(180deg);
}
</style>
