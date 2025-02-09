<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { logUserActivity } from '@/utils/logger';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const props = defineProps<{
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  showProgress?: boolean;
  timestamp?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const progress = ref(100);
const currentTimestamp = '2025-02-09 14:45:23';
let progressInterval: number | null = null;

const closeToast = () => {
  logUserActivity('toast_closed', {
    type: props.type,
    message: props.message,
    timestamp: props.timestamp || currentTimestamp,
    user: 'BadrRibzat'
  });
  emit('close');
};

onMounted(() => {
  logUserActivity('toast_displayed', {
    type: props.type,
    message: props.message,
    timestamp: props.timestamp || currentTimestamp,
    user: 'BadrRibzat'
  });

  if (props.duration && props.showProgress) {
    const updateInterval = 10;
    const steps = props.duration / updateInterval;
    const decrementAmount = 100 / steps;

    progressInterval = window.setInterval(() => {
      progress.value = Math.max(0, progress.value - decrementAmount);
      
      if (progress.value <= 0) {
        closeToast();
      }
    }, updateInterval);
  }

  if (props.duration) {
    setTimeout(closeToast, props.duration);
  }
});

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
});
</script>

<template>
  <div
    class="notification-toast"
    :class="[
      type ? `notification-${type}` : '',
      'fixed right-4 top-4 z-50 max-w-md rounded-lg p-4 shadow-lg',
      'transform transition-all duration-300 ease-in-out',
    ]"
    role="alert"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6 text-green-400" />
        <ExclamationCircleIcon v-else-if="type === 'error'" class="h-6 w-6 text-red-400" />
        <InformationCircleIcon v-else-if="type === 'info'" class="h-6 w-6 text-blue-400" />
        <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-400" />
      </div>

      <div class="ml-3 w-0 flex-1">
        <p v-if="title" class="text-sm font-medium text-gray-900">
          {{ title }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ message }}
        </p>
        <p class="mt-1 text-xs text-gray-400">
          {{ new Date(timestamp || currentTimestamp).toLocaleTimeString() }}
        </p>
      </div>

      <div class="ml-4 flex flex-shrink-0">
        <button
          type="button"
          class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          @click="closeToast"
        >
          <span class="sr-only">Close</span>
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div
      v-if="showProgress && duration"
      class="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-lg overflow-hidden"
    >
      <div
        class="h-full transition-all duration-300 ease-linear"
        :class="{
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
          'bg-yellow-500': type === 'warning'
        }"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.notification-toast {
  @apply bg-white;
}

.notification-success {
  @apply bg-green-50 border-l-4 border-green-400;
}

.notification-error {
  @apply bg-red-50 border-l-4 border-red-400;
}

.notification-info {
  @apply bg-blue-50 border-l-4 border-blue-400;
}

.notification-warning {
  @apply bg-yellow-50 border-l-4 border-yellow-400;
}

.notification-toast {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
