<template>
  <div class="level-test-view">
    <h3>Level Test: {{ test.level }}</h3>
    <LevelTestQuestion 
      v-for="question in test.questions" 
      :key="question.id" 
      :question="question" 
      @answered="handleAnswer"
    />
    <button @click="submitTest">Submit Test</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LevelTestQuestion from './LevelTestQuestion.vue';
import type { LevelTest } from '@/types/lessons';

export default defineComponent({
  components: { LevelTestQuestion },
  props: {
    test: {
      type: Object as () => LevelTest,
      required: true,
    },
  },
  data() {
    return {
      answers: [] as string[],
    };
  },
  methods: {
    handleAnswer(answer: string) {
      this.answers.push(answer);
    },
    async submitTest() {
      if (this.answers.length !== this.test.total_questions) {
        alert('Please answer all questions.');
        return;
      }
      this.$emit('test-completed', { answers: this.answers });
    },
  },
});
</script>
