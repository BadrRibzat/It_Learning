<template>
  <div class="quick-stat bg-white rounded-lg shadow p-4 flex items-center space-x-4">
    <div class="icon flex-shrink-0">
      <component :is="icon" class="h-6 w-6 text-primary-500" />
    </div>
    <div>
      <p class="text-sm font-medium text-gray-900">{{ title }}</p>
      <p class="text-xl font-semibold text-gray-900">{{ value }} <span v-if="suffix" class="text-sm">{{ suffix }}</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
  label: string;
  value: number;
  icon: string;
  suffix?: string;
}>();
</script>

<style scoped>
.quick-stat .icon {
  background-color: rgba(0, 122, 255, 0.1);
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.quick-stat .icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.quick-stat p {
  margin: 0;
}

.quick-stat p:first-child {
  margin-bottom: 0.25rem;
}

.quick-stat p:last-child {
  margin-top: 0.25rem;
}

.quick-stat .text-primary-500 {
  color: #007AFF;
}

.quick-stat .text-gray-900 {
  color: #333;
}

.quick-stat .bg-white {
  background-color: #fff;
}

.quick-stat .rounded-lg {
  border-radius: 0.5rem;
}

.quick-stat .shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.quick-stat .p-4 {
  padding: 1rem;
}

.quick-stat .flex {
  display: flex;
}

.quick-stat .items-center {
  align-items: center;
}

.quick-stat .space-x-4 {
  margin-right: 1rem;
}

.quick-stat .text-sm {
  font-size: 0.875rem;
}

.quick-stat .font-medium {
  font-weight: 500;
}

.quick-stat .text-xl {
  font-size: 1.25rem;
}

.quick-stat .font-semibold {
  font-weight: 600;
}

.quick-stat .text-sm {
  font-size: 0.875rem;
}

.quick-stat .text-primary-500 {
  color: #007AFF;
}
</style>