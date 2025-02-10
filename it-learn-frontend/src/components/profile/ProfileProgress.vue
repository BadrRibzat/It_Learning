<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Profile Progress</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <LearningProgress :currentLevel="currentLevel" :stats="stats" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LearningStats, CurrentLevel } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningProgress from './LearningProgress.vue';

const props = defineProps<{
  stats?: LearningStats;
  currentLevel?: CurrentLevel;
  loading?: boolean;
}>();
</script>
