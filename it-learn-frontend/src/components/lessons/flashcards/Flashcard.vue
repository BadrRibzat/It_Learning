<template>
  <div class="flashcard">
    <h4>{{ flashcard.command }}</h4>
    <p>{{ flashcard.explanation }}</p>
    <p>{{ flashcard.example }}</p>
    <input 
      type="text" 
      v-model="userAnswer" 
      @keyup.enter="submitAnswer"
      placeholder="Your answer here..."
    />
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

<style scoped>
.flashcard {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}
</style>
