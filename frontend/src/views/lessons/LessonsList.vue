<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lessons List</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { lessonService } from '@/api/services/lessons';
import LessonCard from '@/components/lessons/LessonCard.vue';

const lessons = ref([]);

onMounted(async () => {
  const { data } = await lessonService.getLessons();
  lessons.value = data;
});
</script>
