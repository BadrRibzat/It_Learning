<template>
  <div class="question">
    <h4>Question {{ question.order }}: {{ question.question }}</h4>
    <input type="text" v-model="userAnswer" @keyup.enter="submitAnswer" />
    <button @click="submitAnswer">Submit</button>
    <p v-if="showResult">{{ resultMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Question } from '@/types/lessons';

export default defineComponent({
  props: {
    question: {
      type: Object as () => Question,
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
      const isCorrect = this.userAnswer.trim().toLowerCase() === this.question.answer.toLowerCase();
      this.showResult = true;
      this.resultMessage = isCorrect ? 'Correct!' : 'Incorrect!';
      this.$emit('answered', { id: this.question.id, answer: this.userAnswer });
    },
  },
});
</script>
