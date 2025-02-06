<template>
  <div
    class="notification-toast"
    :class="[
      type ? `notification-${type}` : '',
      'fixed right-4 top-4 z-50 max-w-md rounded-lg p-4 shadow-lg',
      'transform transition-all duration-300 ease-in-out',
    ]"
  >
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6 text-green-400" />
        <ExclamationCircleIcon v-else-if="type === 'error'" class="h-6 w-6 text-red-400" />
        <InformationCircleIcon v-else-if="type === 'info'" class="h-6 w-6 text-blue-400" />
        <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-400" />
      </div>

      <!-- Content -->
      <div class="ml-3 w-0 flex-1">
        <p v-if="title" class="text-sm font-medium text-gray-900">
          {{ title }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ message }}
        </p>
      </div>

      <!-- Close Button -->
      <div class="ml-4 flex flex-shrink-0">
        <button
          type="button"
          class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          @click="closeToast"
        >
          <span class="sr-only">Close</span>
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div
      v-if="showProgress && duration"
      class="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-lg overflow-hidden"
    >
      <div
        class="h-full bg-current transition-all duration-300 ease-linear"
        :class="[
          type === 'success' ? 'bg-green-500' :
          type === 'error' ? 'bg-red-500' :
          type === 'info' ? 'bg-blue-500' :
          type === 'warning' ? 'bg-yellow-500' : ''
        ]"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, PropType } from 'vue';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export default defineComponent({
  name: 'NotificationToast',
  components: {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
  },
  props: {
    type: {
      type: String as PropType<ToastType>,
      default: 'info',
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000,
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const progress = ref(100);
    let progressInterval: number | null = null;

    const closeToast = () => {
      emit('close');
    };

    onMounted(() => {
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

    return {
      progress,
      closeToast,
    };
  },
});
</script>

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
</style>
