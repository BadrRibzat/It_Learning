<template>
  <div class="flashcard-question">
    <h4>Question: {{ flashcard.question }}</h4>
    <input type="text" v-model="userAnswer" @keyup.enter="submitAnswer" />
    <button @click="submitAnswer">Submit</button>
    <p v-if="showResult">{{ resultMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Flashcard } from '@/types/lessons';

export default defineComponent({
  props: {
    flashcard: {
      type: Object as () => Flashcard,
      required: true,
    },
  },
  data() {
    return {
      userAnswer: '',
      showResult: false,
      resultMessage: '',
    };
  },
  methods: {
    submitAnswer() {
      const isCorrect = this.userAnswer.trim().toLowerCase() === this.flashcard.answer.toLowerCase();
      this.showResult = true;
      this.resultMessage = isCorrect ? 'Correct!' : 'Incorrect!';
      this.$emit('answered', { id: this.flashcard.id, answer: this.userAnswer });
    },
  },
});
</script>
