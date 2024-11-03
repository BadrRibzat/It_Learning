<template>
  <div class="flashcards">
    <h1>Flashcards</h1>
    <div v-if="flashcards.length">
      <div v-for="flashcard in flashcards" :key="flashcard.id" class="flashcard">
        <h2>{{ flashcard.word }}</h2>
        <p>{{ flashcard.definition }}</p>
        <button @click="practiceFlashcard(flashcard.id)">Practice</button>
      </div>
    </div>
    <div v-else>
      <p>Loading flashcards...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FlashcardsComponent',
  computed: {
    ...mapGetters(['flashcards']),
  },
  methods: {
    ...mapActions(['fetchFlashcards']),
    practiceFlashcard(flashcardId) {
      // Logic to practice flashcard
      console.log(`Practice flashcard ${flashcardId}`);
    },
  },
  async created() {
    await this.fetchFlashcards();
  },
};
</script>

<style scoped>
.flashcards {
  padding: 2rem;
}

.flashcard {
  margin-bottom: 2rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
