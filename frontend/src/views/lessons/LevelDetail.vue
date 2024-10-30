<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{{ level.name }}</h1>
    <p class="text-gray-600 mb-6">{{ level.description }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import LessonCard from '@/components/lessons/LessonCard.vue';

const route = useRoute();
const store = useStore();
const levelId = route.params.levelId;
const level = ref({});
const lessons = ref([]);

onMounted(async () => {
  try {
    await store.dispatch('lessons/fetchLevel', levelId);
    level.value = store.getters['lessons/currentLevel'];
    await store.dispatch('lessons/fetchLessons', levelId);
    lessons.value = store.getters['lessons/allLessons'];
  } catch (error) {
    console.error('Error fetching level details:', error);
  }
});
</script>
