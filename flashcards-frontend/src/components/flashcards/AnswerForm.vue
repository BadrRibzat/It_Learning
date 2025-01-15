<template>
  <form @submit.prevent="submitAnswer">
    <div class="mb-4">
      <label for="answer" class="block text-sm font-medium text-gray-700">Your answer</label>
      <input
        v-model="userAnswer"
        type="text"
        id="answer"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        placeholder="Type your answer here"
      >
    </div>
    <button
      type="submit"
      class="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Submit Answer
    </button>
    <div v-if="showFeedback" class="mt-4 p-2 rounded" :class="feedbackClass">
      {{ feedbackMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  flashcardId: {
    type: Number,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['answer-submitted']);

const userAnswer = ref('');
const showFeedback = ref(false);
const isCorrect = ref(false);

const feedbackClass = computed(() => {
  return isCorrect.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
});

const feedbackMessage = computed(() => {
  return isCorrect.value ? 'Correct! Well done!' : `Incorrect. The correct answer is "${props.correctAnswer}".`;
});

const submitAnswer = async () => {
  try {
    const result = await store.dispatch('flashcards/submitAnswer', { id: props.flashcardId, answer: userAnswer.value });
    isCorrect.value = result.isCorrect;
    showFeedback.value = true;
    emit('answer-submitted', { isCorrect: result.isCorrect, userAnswer: userAnswer.value });
  } catch (error) {
    console.error('Error submitting answer:', error);
  } finally {
    setTimeout(() => {
      showFeedback.value = false;
      userAnswer.value = '';
    }, 2000);
  }
};
</script>
