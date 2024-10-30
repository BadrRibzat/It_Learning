<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Learning Levels</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LevelCard v-for="level in levels" :key="level.id" :level="level" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import LevelCard from '@/components/lessons/LevelCard.vue';

const store = useStore();
const levels = ref([]);

onMounted(async () => {
  await store.dispatch('lessons/fetchLevels');
  levels.value = store.getters['lessons/allLevels'];
});
</script>
