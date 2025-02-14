<template>
  <div class="level-progress">
    <h4>Level Progress</h4>
    <ul>
      <li 
        v-for="(lessonProgress, index) in levelProgress.lessons_progress" 
        :key="index"
        :class="{ completed: lessonProgress.quiz_unlocked }"
      >
        Lesson {{ index + 1 }}: 
        {{ lessonProgress.completed_flashcards }} / {{ lessonProgress.total_flashcards }} Flashcards Completed
      </li>
    </ul>
    <p v-if="levelProgress.level_test_available">Level Test Available</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLessonsStore } from '@/stores/lessons';
import { LevelProgress } from '@/types/lessons';

export default defineComponent({
  props: {
    levelId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  computed: {
    levelProgress(): LevelProgress | null {
      return this.lessonsStore.levelProgressMap[this.levelId] || null;
    },
  },
});
</script>

<style scoped>
.level-progress {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}

li.completed {
  color: green;
  font-weight: bold;
}
</style>
