<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Profile Overview</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <ProfileInfo :profile="profile" :loading="loading" />
      <LearningProgress :currentLevel="currentLevel" :stats="stats" :loading="loading" />
      <LearningStatistics :stats="stats" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserProfile, LearningStats, CurrentLevel } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ProfileInfo from './ProfileInfo.vue';
import LearningProgress from './LearningProgress.vue';
import LearningStatistics from './LearningStatistics.vue';

const props = defineProps<{
  profile?: UserProfile;
  stats?: LearningStats;
  currentLevel?: CurrentLevel;
  loading?: boolean;
}>();
</script>
