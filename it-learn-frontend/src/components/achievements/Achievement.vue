<template>
  <div 
    class="achievement-card group"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div 
      class="p-4 bg-white rounded-lg border transition-all duration-200"
      :class="[
        achievement.earned_at 
          ? 'border-primary-200 hover:border-primary-300 hover:shadow-md' 
          : 'border-gray-200 opacity-50'
      ]"
    >
      <div class="flex flex-col items-center">
        <!-- Achievement Icon -->
        <div 
          class="achievement-icon w-16 h-16 rounded-full flex items-center justify-center mb-3"
          :class="[achievement.earned_at ? getLevelColorClass(achievement.name) : 'bg-gray-100']"
        >
          <img 
            :src="achievement.icon"
            :alt="achievement.name"
            class="w-12 h-12 transition-transform duration-200 group-hover:scale-110"
            :class="{'filter grayscale': !achievement.earned_at}"
          />
        </div>

        <!-- Achievement Name -->
        <h3 class="text-sm font-medium text-center">{{ achievement.name }}</h3>
        
        <!-- Earned Date -->
        <p 
          v-if="achievement.earned_at"
          class="text-xs text-gray-500 mt-1"
        >
          Earned {{ formatDate(achievement.earned_at) }}
        </p>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="showTooltip"
      class="achievement-tooltip"
    >
      <h4 class="font-medium mb-2 text-primary-700">{{ achievement.name }}</h4>
      <p class="text-sm text-gray-600">{{ achievement.description }}</p>
      
      <!-- Progress Bar (for unearned achievements) -->
      <div v-if="!achievement.earned_at" class="mt-3">
        <p class="text-xs text-primary-600 font-medium">
          Progress: {{ achievement.progress || 0 }}/{{ achievement.required || 100 }}
        </p>
        <div class="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            class="h-full bg-primary-500 rounded-full transition-all duration-300"
            :style="`width: ${getProgressPercentage}%`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Achievement } from '@/types/profile';

const props = defineProps<{
  achievement: Achievement;
}>();

const showTooltip = ref(false);

// Computed property for progress percentage
const getProgressPercentage = computed(() => {
  const progress = props.achievement.progress || 0;
  const required = props.achievement.required || 100;
  return Math.min((progress / required) * 100, 100);
});

// Method to get color class based on achievement level
const getLevelColorClass = (name: string) => {
  const levelColors = {
    'Beginner': 'bg-green-100',
    'Intermediate': 'bg-yellow-100',
    'Advanced': 'bg-orange-100',
    'Expert': 'bg-red-100'
  };
  
  const level = Object.keys(levelColors).find(key => 
    name.toLowerCase().includes(key.toLowerCase())
  );
  
  return level ? levelColors[level as keyof typeof levelColors] : 'bg-gray-100';
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.achievement-card {
  @apply relative cursor-pointer;
}

.achievement-tooltip {
  @apply absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 
         transform -translate-y-full -translate-x-1/4 -top-2 opacity-0 invisible
         transition-all duration-200 group-hover:opacity-100 group-hover:visible;
}

.achievement-icon img {
  @apply object-contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Animation for earned achievements */
.achievement-card:hover .achievement-icon {
  @apply transform scale-105 transition-transform duration-200;
}
</style>