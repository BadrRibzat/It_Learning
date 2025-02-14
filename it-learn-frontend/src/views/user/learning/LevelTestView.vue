<template>
  <div class="level-test-view">
    <h2>Level Test: {{ levelTest.level }}</h2>
    <p>Passing Score: {{ levelTest.passing_score * 100 }}%</p>
    <Question 
      v-for="question in levelTest.questions" 
      :key="question.id" 
      :question="question" 
      @answered="handleAnswer"
    />
    <button @click="submitTest">Submit Test</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLessonsStore } from '@/stores/lessons';
import Question from '@/components/lessons/quiz/Question.vue';

export default defineComponent({
  components: { Question },
  props: ['levelId'],
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      levelTest: null as any,
      answers: [] as string[],
    };
  },
  async mounted() {
    this.levelTest = await this.lessonsStore.getLevelTest(this.levelId);
  },
  methods: {
    handleAnswer(answer: string) {
      this.answers.push(answer);
    },
    async submitTest() {
      if (this.answers.length !== this.levelTest.total_questions) {
        alert('Please answer all questions.');
        return;
      }
      const response = await this.lessonsStore.submitLevelTest(this.levelId, { answers: this.answers });
      if (response.next_level_unlocked) {
        this.$router.push('/next-level');
      }
    },
  },
});
</script>
