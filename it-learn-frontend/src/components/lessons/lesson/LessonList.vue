<template>
  <div class="lesson-list">
    <h3>Lessons</h3>
    <ul>
      <li 
        v-for="lesson in lessons" 
        :key="lesson.id" 
        :class="{ completed: lesson.completed }"
      >
        {{ lesson.title }} - {{ lesson.progress.completed_flashcards }} / {{ lesson.progress.total_flashcards }}
        <button @click="selectLesson(lesson)">Start Lesson</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Lesson } from '@/types/lessons';

export default defineComponent({
  props: {
    levelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      lessons: [] as Lesson[],
    };
  },
  async mounted() {
    try {
      const lessonsStore = useLessonsStore();
      this.lessons = await lessonsStore.getLessons(this.levelId);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  },
  methods: {
    selectLesson(lesson: Lesson) {
      this.$emit('lesson-selected', lesson);
    },
  },
});
</script>

<style scoped>
.lesson-list li.completed {
  color: green;
  font-weight: bold;
}
</style>
