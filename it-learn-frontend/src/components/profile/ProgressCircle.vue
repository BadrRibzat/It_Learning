<template>
  <div class="text-center">
    <svg class="w-24 h-24 mx-auto" viewBox="0 0 36 36">
      <path
        class="text-gray-200"
        stroke-width="3.8"
        fill="none"
        d="M18 1.0845
          a 16.9155 16.9155 0 0 1 0 33.831
          a 16.9155 16.9155 0 0 1 0 -33.831"
      />
      <path
        :class="color"
        stroke-width="3.8"
        fill="none"
        stroke-dasharray="100, 100"
        :style="{ strokeDasharray: `${progress}, 100` }"
        d="M18 1.0845
          a 16.9155 16.9155 0 0 1 0 33.831
          a 16.9155 16.9155 0 0 1 0 -33.831"
      />
    </svg>
    <p class="mt-2 text-lg font-semibold">{{ title }}</p>
    <p class="text-sm text-gray-600" v-if="showDays">{{ progress }} days</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  progress: number;
  color: string;
  showDays?: boolean;
}>();
</script>
