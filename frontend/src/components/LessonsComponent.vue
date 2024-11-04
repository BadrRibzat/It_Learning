<template>
  <div class="lessons">
    <h1>Lessons</h1>
    <div v-if="lessons.length">
      <div v-for="lesson in lessons" :key="lesson.id" class="lesson">
        <h2>{{ lesson.title }}</h2>
        <p>{{ lesson.content }}</p>
        <button @click="startLesson(lesson.id)" :disabled="!canStartLesson(lesson)">
          {{ lessonButtonText(lesson) }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No lessons available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LessonsComponent',
  computed: {
    ...mapGetters(['lessons', 'userProgress']),
  },
  methods: {
    ...mapActions(['fetchLessons', 'fetchUserProgress']),
    startLesson(lessonId) {
      this.$router.push(`/lesson/${lessonId}`);
    },
    canStartLesson(lesson) {
      if (lesson.level_order === 1) return true;
      const previousLesson = this.lessons.find(l => l.level_order === lesson.level_order - 1);
      if (!previousLesson) return true;
      return this.userProgress.some(progress => progress.lesson === previousLesson.id && progress.completed);
    },
    lessonButtonText(lesson) {
      if (this.userProgress.some(progress => progress.lesson === lesson.id && progress.completed)) {
        return 'Review Lesson';
      }
      return this.canStartLesson(lesson) ? 'Start Lesson' : 'Locked';
    },
  },
  async created() {
    try {
      await this.fetchLessons();
      await this.fetchUserProgress();
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  },
};
</script>

<style scoped>
.lessons {
  padding: 2rem;
}

.lesson {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #35495e;
}
</style>
