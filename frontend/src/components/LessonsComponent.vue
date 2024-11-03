<template>
  <div class="lessons">
    <h1>Lessons</h1>
    <div v-if="lessons.length">
      <div v-for="lesson in lessons" :key="lesson.id" class="lesson">
        <h2>{{ lesson.title }}</h2>
        <p>{{ lesson.content }}</p>
        <button @click="startLesson(lesson.id)">Start Lesson</button>
      </div>
    </div>
    <div v-else>
      <p>Loading lessons...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LessonsComponent',
  computed: {
    ...mapGetters(['lessons']),
  },
  methods: {
    ...mapActions(['fetchLessons']),
    startLesson(lessonId) {
      // Logic to start lesson
      console.log(`Start lesson ${lessonId}`);
    },
  },
  async created() {
    await this.fetchLessons();
  },
};
</script>

<style scoped>
.lessons {
  padding: 2rem;
}

.lesson {
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
