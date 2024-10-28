<template>
  <div class="relative w-full h-64 perspective-1000" @click="isFlipped = !isFlipped">
    <div
      class="absolute w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front side -->
      <div
        class="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden"
      >
        <div class="h-full flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ flashcard.question }}</h3>
            <p class="mt-2 text-gray-600">{{ flashcard.meaning }}</p>
          </div>
          <p class="text-sm text-gray-500">{{ $t('click_to_flip') }}</p>
        </div>
      </div>

      <!-- Back side -->
      <div
        class="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden rotate-y-180"
      >
        <div class="h-full flex flex-col justify-between">
          <div>
            <p class="text-lg font-medium text-gray-900">
              {{ flashcard.question }}
            </p>
            <input
              v-model="answer"
              type="text"
              class="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              :placeholder="$t('type_your_answer')"
              @keyup.enter="checkAnswer"
              @click.stop
            />
            <div
              v-if="showFeedback"
              class="mt-4 p-2 rounded"
              :class="feedbackClass"
            >
              {{ feedbackMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  flashcard: {
    type: Object,
    required: true,
  },
});

const isFlipped = ref(false);
const answer = ref('');
const showFeedback = ref(false);
const isCorrect = ref(false);

const feedbackClass = computed(() => {
  return isCorrect.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
});

const feedbackMessage = computed(() => {
  return isCorrect.value
    ? 'Correct! Well done! 🎉'
    : `Not quite. The correct word is "${props.flashcard.answer}". Try again!`;
});

const checkAnswer = () => {
  isCorrect.value = answer.value.toLowerCase() === props.flashcard.answer.toLowerCase();
  showFeedback.value = true;
  setTimeout(() => {
    if (isCorrect.value) {
      answer.value = '';
      isFlipped.value = false;
      showFeedback.value = false;
    }
  }, 2000);
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
