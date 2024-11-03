<template>
  <div class="quiz">
    <h3>{{ quiz.title }}</h3>
    <ul>
      <li v-for="question in quiz.questions" :key="question.id">
        <p>{{ question.text }}</p>
        <input v-model="answers[question.id]" type="text" placeholder="Your answer" />
      </li>
    </ul>
    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<script>
export default {
  props: {
    quiz: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      answers: {},
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.quiz.id, this.answers);
      this.answers = {};
    },
  },
};
</script>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
