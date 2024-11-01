<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-xl font-bold mb-2">{{ lesson.title }}</h3>
    <p class="text-gray-600">{{ lesson.description }}</p>
    <div class="mt-4 flex justify-end">
      <router-link
        :to="{ name: 'LessonDetail', params: { lessonId: lesson.id } }"
        class="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
      >
        Start Lesson
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
</script>
