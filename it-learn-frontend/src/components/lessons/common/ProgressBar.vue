<template>
  <div class="progress-bar">
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span v-if="label" class="text-xs font-semibold inline-block text-primary-600">
            {{ label }}
          </span>
        </div>
        <div v-if="showPercentage" class="text-right">
          <span class="text-xs font-semibold inline-block text-primary-600">
            {{ percentage }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
        <div
          :style="{ width: `${percentage}%` }"
          class="transition-all duration-300 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}>();

const percentage = computed(() => {
  return Math.round((props.value / props.max) * 100);
});
</script>
