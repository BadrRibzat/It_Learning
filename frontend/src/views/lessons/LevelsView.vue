<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{{ $t('lessons.availableLevels') }}</h1>
    <div v-if="loading" class="text-center">
      <p>{{ $t('common.loading') }}</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    await store.dispatch('lessons/fetchLevels');
    levels.value = store.getters['lessons/allLevels'];
  } catch (err) {
    error.value = $t('lessons.failedToLoadLevels');
  } finally {
    loading.value = false;
  }
});
</script>
