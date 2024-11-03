<template>
  <div class="flashcard-list">
    <h2>Flashcards</h2>
    <ul>
      <li v-for="flashcard in flashcards" :key="flashcard.id">
        <Flashcard :flashcard="flashcard" @submit="handleFlashcardSubmit" />
      </li>
    </ul>
  </div>
</template>

<script>
import Flashcard from './Flashcard.vue';

export default {
  components: {
    Flashcard,
  },
  props: {
    flashcards: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleFlashcardSubmit(flashcardId, answer) {
      this.$emit('submit', flashcardId, answer);
    },
  },
};
</script>

<style scoped>
.flashcard-list {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}
</style>
