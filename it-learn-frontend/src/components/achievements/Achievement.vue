<template>
  <div 
    class="relative group"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div 
      class="p-4 bg-white rounded-lg border transition-all duration-200"
      :class="[
        achievement.unlocked 
          ? 'border-primary-200 hover:border-primary-300' 
          : 'border-gray-200 opacity-50'
      ]"
    >
      <div class="flex flex-col items-center">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center mb-2"
          :class="achievement.unlocked ? badgeColorClass : 'bg-gray-100'"
        >
          <img 
            v-if="achievement.icon"
            :src="achievement.icon"
            :alt="achievement.name"
            class="w-8 h-8"
          />
          <TrophyIcon
            v-else
            class="w-6 h-6"
            :class="achievement.unlocked ? 'text-primary-600' : 'text-gray-400'"
          />
        </div>
        <h3 class="text-sm font-medium text-center">{{ achievement.name }}</h3>
        <p 
          v-if="showDate && achievement.earned_at"
          class="text-xs text-gray-500 mt-1"
        >
          {{ formatDate(achievement.earned_at) }}
        </p>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="showTooltip"
      class="absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 transform -translate-y-full -translate-x-1/4 -top-2"
    >
      <h4 class="font-medium mb-2">{{ achievement.name }}</h4>
      <p class="text-sm text-gray-600">{{ achievement.description }}</p>
      <div v-if="!achievement.unlocked" class="mt-2">
        <p class="text-xs text-primary-600">
          Progress: {{ achievement.progress || 0 }}/{{ achievement.required }}
        </p>
        <div class="w-full h-1 bg-gray-200 rounded-full mt-1">
          <div
            class="h-full bg-primary-500 rounded-full"
            :style="`width: ${(achievement.progress || 0) / achievement.required * 100}%`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrophyIcon } from '@heroicons/vue/24/outline';
import type { Achievement } from '@/types/profile';

const props = defineProps<{
  achievement: Achievement;
  showDate?: boolean;
}>();

const showTooltip = ref(false);

const badgeColorClass = computed(() => {
  const colors = {
    bronze: 'bg-orange-100',
    silver: 'bg-gray-100',
    gold: 'bg-yellow-100',
    platinum: 'bg-blue-100'
  };
  return colors[props.achievement.tier || 'bronze'];
});

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>
