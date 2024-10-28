<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{{ level.name }}</h1>
    <p class="text-gray-600 mb-6">{{ level.description }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { lessonService } from '@/api/services/lessons';
import LessonCard from '@/components/lessons/LessonCard.vue';

const route = useRoute();
const levelId = route.params.levelId;
const level = ref({});
const lessons = ref([]);

onMounted(async () => {
  const { data } = await lessonService.getLevel(levelId);
  level.value = data;
  const { data: lessonData } = await lessonService.getLessons(levelId);
  lessons.value = lessonData;
});
</script>
