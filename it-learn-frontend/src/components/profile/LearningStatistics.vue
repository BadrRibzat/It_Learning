<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Learning Statistics</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <QuickStat 
        title="Total Points" 
        :value="stats?.total_points || 0" 
        suffix=" pts" 
      />
      <QuickStat 
        title="Completed Lessons" 
        :value="`${stats?.completed_lessons || 0}/${stats?.total_lessons || 0}`" 
      />
      <QuickStat 
        title="Level Tests Passed" 
        :value="stats?.level_tests_passed || 0" 
      />
      <QuickStat 
        title="Current Streak" 
        :value="stats?.streak?.current_streak || 0" 
        suffix=" days" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LearningStats } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import QuickStat from './QuickStat.vue';

const props = defineProps<{
  stats?: LearningStats;
  loading?: boolean;
}>();
</script>

<style scoped>
.quick-stat {
  margin-bottom: 1.5rem;
}

.quick-stat:last-child {
  margin-bottom: 0;
}

.quick-stat .value {
  font-size: 1.5rem;
}

.quick-stat .title {
  font-size: 0.875rem;
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
}

.loading-spinner svg {
  width: 3rem;
  height: 3rem;
}

.loading-spinner path {
  stroke: #4b5563;
}

.loading-spinner circle {
  stroke: #4b5563;
}

.loading-spinner .path {
  stroke: #4b5563;
}

</style>
