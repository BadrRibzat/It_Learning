<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Lesson Content</h2>
      <LearningTimer 
        v-if="isActive"
        :start-time="startTime"
        @time-update="handleTimeUpdate"
      />
    </div>

    <div class="space-y-6">
      <ProgressBar
        :value="currentStep"
        :max="totalSteps"
        class="mb-4"
      />

      <div class="flex justify-between text-sm text-gray-600 mb-4">
        <span>Progress: {{ currentStep }}/{{ totalSteps }}</span>
        <span>{{ progressPercentage }}% Complete</span>
      </div>

      <div class="flex justify-between space-x-4">
        <button
          v-if="canNavigate"
          @click="$emit('previous')"
          :disabled="currentStep === 1"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="currentStep === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Previous
        </button>

        <button
          v-if="canNavigate"
          @click="$emit('next')"
          :disabled="currentStep === totalSteps"
          class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ currentStep === totalSteps ? 'Complete' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import LearningTimer from '@/components/common/LearningTimer.vue';
import ProgressBar from '@/components/common/ProgressBar.vue';

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
  canNavigate?: boolean;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'previous'): void;
  (e: 'next'): void;
  (e: 'time-update', time: number): void;
}>();

const startTime = ref(Date.now());

const progressPercentage = computed(() => {
  return Math.round((props.currentStep / props.totalSteps) * 100);
});

const handleTimeUpdate = (time: number) => {
  emit('time-update', time);
};
</script>
