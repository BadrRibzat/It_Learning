<template>
  <div class="lessons-list">
    <h1>Lessons</h1>
    <ul>
      <li v-for="lesson in lessons" :key="lesson.id" @click="handleLessonClick(lesson.id)">
        {{ lesson.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    lessons: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleLessonClick(lessonId) {
      this.$router.push(`/lessons/${lessonId}`);
    },
  },
};
</script>

<style scoped>
.lessons-list {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 4px;
}

li:hover {
  background-color: #f0f0f0;
}
</style>
