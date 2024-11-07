<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Levels</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LevelCard v-for="level in levels" :key="level.id" :level="level" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import LevelCard from '@/components/levels/LevelCard.vue';

const store = useStore();
const levels = ref([]);

onMounted(async () => {
  await store.dispatch('levels/fetchLevels');
  levels.value = store.state.levels.levels;
});
</script>
