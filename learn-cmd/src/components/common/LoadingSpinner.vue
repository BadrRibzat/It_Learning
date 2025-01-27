<template>
  <div :class="wrapperClass">
    <!-- Fullscreen Overlay -->
    <div v-if="fullscreen" 
         class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 flex flex-col items-center">
        <div class="relative">
          <!-- Spinner -->
          <div :class="[
            'animate-spin rounded-full border-4 border-gray-200',
            sizeClasses[size],
            {'border-t-primary': !inverse, 'border-t-white': inverse}
          ]"></div>
        </div>
        <span v-if="label" class="mt-4 text-gray-700 font-medium">{{ label }}</span>
      </div>
    </div>

    <!-- Regular Spinner -->
    <div v-else class="relative">
      <div :class="[
        'animate-spin rounded-full border-4 border-gray-200',
        sizeClasses[size],
        {'border-t-primary': !inverse, 'border-t-white': inverse}
      ]"></div>
      <span v-if="label" 
            :class="[
              'mt-4 block text-center',
              inverse ? 'text-white' : 'text-gray-700'
            ]">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  inverse: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  }
});

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4'
};

const wrapperClass = computed(() => ({
  'flex items-center justify-center': props.center,
  'fixed inset-0 z-50': props.fullscreen
}));
</script>

<style scoped>
@keyframes custom-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: custom-spin 1s linear infinite;
}
</style>
