<template>
  <div class="flashcard-progress space-y-4">
    <div class="flex items-center justify-between text-sm text-gray-600">
      <div class="flex items-center space-x-2">
        <span class="font-medium">Card {{ currentIndex + 1 }} of {{ total }}</span>
        <div class="flex items-center space-x-1">
          <CheckCircleIcon 
            v-if="correctAnswers > 0"
            class="w-5 h-5 text-green-500" 
          />
          <span class="text-green-600">{{ correctAnswers }} correct</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <StarIcon class="w-5 h-5 text-yellow-500" />
        <span>{{ points }} points</span>
      </div>
    </div>

    <ProgressBar
      :value="currentIndex + 1"
      :max="total"
      class="mb-2"
    />

    <div class="grid grid-cols-10 gap-1">
      <div 
        v-for="index in total" 
        :key="index"
        class="h-1.5 rounded"
        :class="getProgressIndicatorClass(index - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircleIcon, StarIcon } from '@heroicons/vue/24/solid';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  currentIndex: number;
  total: number;
  correctAnswers: number;
  points: number;
  answeredCards: boolean[];
}>();

const getProgressIndicatorClass = (index: number) => {
  if (index > props.currentIndex) return 'bg-gray-200';
  if (!props.answeredCards[index]) return 'bg-gray-400';
  return 'bg-green-500';
};
</script>
