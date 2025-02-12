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
import type { LearningStats, CurrentLevel } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningProgress from './LearningProgress.vue';

const props = defineProps<{
  stats?: LearningStats;
  currentLevel?: CurrentLevel;
  loading?: boolean;
}>();
</script>

<style scoped>
  .progress-bar {
    height: 10px;
    background-color: #f3f4f6;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }

  .progress-bar .progress {
    height: 100%;
    background-color: #10b981;
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.3s;
  }

  .progress-bar .progress span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }

  .progress-bar .progress span::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #10b981;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .progress-bar .progress span::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #10b981;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .progress-bar .progress span::before,
  .progress-bar .progress span::after {
    display: none;
  }

</style>