<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-xl font-bold mb-4">{{ flashcard.word }}</h3>
    <p class="text-gray-600 mb-4">{{ flashcard.definition }}</p>
    <input
      v-model="userAnswer"
      type="text"
      class="w-full px-3 py-2 border border-gray-300 rounded-md"
      placeholder="Type your answer"
      @keyup.enter="checkAnswer"
    />
    <button
      @click="checkAnswer"
      class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
    >
      Submit
    </button>
    <p v-if="showFeedback" :class="{ 'text-green-600': isCorrect, 'text-red-600': !isCorrect }" class="mt-4">
      {{ feedbackMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  flashcard: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['next']);

const store = useStore();
const userAnswer = ref('');
const showFeedback = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref('');

const checkAnswer = async () => {
  try {
    const result = await store.dispatch('lessons/submitFlashcard', {
      flashcardId: props.flashcard.id,
      answer: userAnswer.value,
    });
    isCorrect.value = result.is_correct;
    feedbackMessage.value = isCorrect.value ? 'Correct!' : `Incorrect. The correct answer is "${props.flashcard.word}".`;
    showFeedback.value = true;
    if (isCorrect.value) {
      setTimeout(() => {
        emit('next');
      }, 1500);
    }
  } catch (error) {
    console.error('Error submitting flashcard answer:', error);
  }
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
