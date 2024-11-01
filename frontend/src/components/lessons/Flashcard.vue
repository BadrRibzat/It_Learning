<template>
  <div 
    class="bg-white rounded-lg shadow-md p-6 cursor-pointer perspective-1000"
    @click="flip"
  >
    <div 
      class="relative w-full h-64 transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front side -->
      <div class="absolute w-full h-full backface-hidden">
        <h3 class="text-xl font-bold mb-4">{{ flashcard.question }}</h3>
        <p class="text-gray-600 mb-4">{{ flashcard.definition }}</p>
        <p class="text-sm text-gray-500">Click to flip</p>
      </div>

      <!-- Back side -->
      <div class="absolute w-full h-full backface-hidden rotate-y-180">
        <h3 class="text-xl font-bold mb-4">Fill in the blank:</h3>
        <p class="text-gray-600 mb-4">{{ getQuestionWithBlank }}</p>
        <input
          v-model="userAnswer"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Type your answer"
          @keyup.enter="checkAnswer"
          @click.stop
        />
        <button
          @click.stop="checkAnswer"
          class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Submit
        </button>
        <p v-if="showFeedback" :class="{ 'text-green-600': isCorrect, 'text-red-600': !isCorrect }" class="mt-4">
          {{ feedbackMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
const isFlipped = ref(false);

const getQuestionWithBlank = computed(() => {
  return props.flashcard.question.replace(props.flashcard.word, '______');
});

const flip = () => {
  isFlipped.value = !isFlipped.value;
};

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
        isFlipped.value = false;
        userAnswer.value = '';
        showFeedback.value = false;
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
