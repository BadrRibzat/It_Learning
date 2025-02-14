<template>
  <div class="flashcard-card">
    <h4>{{ flashcard.command }}</h4>
    <p>{{ flashcard.explanation }}</p>
    <p>{{ flashcard.example }}</p>
    <button @click="startPractice">Practice</button>
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
  methods: {
    startPractice() {
      this.$emit('start-practice');
    },
  },
});
</script>

<style scoped>
.flashcard-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}
</style>
