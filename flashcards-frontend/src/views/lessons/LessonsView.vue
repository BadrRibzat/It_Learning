<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Lessons</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import LessonCard from '@/components/lessons/LessonCard.vue';

const store = useStore();
const lessons = ref([]);

onMounted(async () => {
  await store.dispatch('lessons/fetchLessons');
  lessons.value = store.state.lessons.lessons;
});
</script>
