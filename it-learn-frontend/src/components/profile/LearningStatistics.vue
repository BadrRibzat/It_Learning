<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Learning Statistics</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <QuickStat title="Total Lessons" :value="stats?.total_lessons || 0" />
      <QuickStat title="Completed Lessons" :value="stats?.completed_lessons || 0" />
      <QuickStat title="Quiz Average" :value="`${(stats?.quiz_average || 0) * 100}%`" />
      <QuickStat title="Streak" :value="stats?.streak?.current_streak || 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LearningStats } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import QuickStat from './QuickStat.vue';

const props = defineProps<{
  stats?: LearningStats;
  loading?: boolean;
}>();
</script>
