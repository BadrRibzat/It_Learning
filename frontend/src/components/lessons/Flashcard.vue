<template>
  <div class="flashcard">
    <h3>{{ flashcard.word }}</h3>
    <input v-model="answer" type="text" placeholder="Your answer" />
    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<script>
export default {
  props: {
    flashcard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      answer: '',
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.flashcard.id, this.answer);
      this.answer = '';
    },
  },
};
</script>

<style scoped>
.flashcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
