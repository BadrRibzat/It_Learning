<template>
  <div
    v-if="showNotification"
    :class="[
      'fixed',
      positionClass,
      'p-4 rounded-lg shadow-lg text-white transition-all duration-300',
      typeClasses,
      animationClasses,
    ]"
    @mouseenter="pauseTimeout"
    @mouseleave="resumeTimeout"
  >
    <div class="flex items-center">
      <div v-if="icon" class="mr-2">
        <i :class="icon"></i>
      </div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value),
    },
    duration: {
      type: Number,
      default: 3000, // Duration in milliseconds
    },
    position: {
      type: String,
      default: 'bottom-right',
      validator: (value) =>
        ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(
          value
        ),
    },
  },
  setup(props) {
    const showNotification = ref(false);
    const timer = ref(null);
    const isPaused = ref(false);

    const positionClass = computed(() => {
      switch (props.position) {
        case 'top-right':
          return 'top-4 right-4';
        case 'top-left':
          return 'top-4 left-4';
        case 'bottom-right':
          return 'bottom-4 right-4';
        case 'bottom-left':
          return 'bottom-4 left-4';
        case 'top-center':
          return 'top-4 left-1/2 transform -translate-x-1/2';
        case 'bottom-center':
          return 'bottom-4 left-1/2 transform -translate-x-1/2';
        default:
          return 'bottom-4 right-4';
      }
    });

    const typeClasses = computed(() => {
      switch (props.type) {
        case 'success':
          return 'bg-green-500';
        case 'error':
          return 'bg-red-500';
        case 'warning':
          return 'bg-yellow-500';
        case 'info':
          return 'bg-blue-500';
        default:
          return 'bg-blue-500';
      }
    });

    const animationClasses = computed(() => ({
      'opacity-0': !showNotification.value,
      'opacity-100': showNotification.value,
      'translate-y-4': props.position.startsWith('bottom') && showNotification.value,
      '-translate-y-4': props.position.startsWith('top') && showNotification.value,
    }));

    const icon = computed(() => {
      switch (props.type) {
        case 'success':
          return 'fas fa-check-circle';
        case 'error':
          return 'fas fa-times-circle';
        case 'warning':
          return 'fas fa-exclamation-triangle';
        case 'info':
          return 'fas fa-info-circle';
        default:
          return 'fas fa-info-circle';
      }
    });

    const startTimeout = () => {
      timer.value = setTimeout(() => {
        showNotification.value = false;
      }, props.duration);
    };

    const pauseTimeout = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        isPaused.value = true;
      }
    };

    const resumeTimeout = () => {
      if (isPaused.value) {
        startTimeout();
        isPaused.value = false;
      }
    };

    onMounted(() => {
      showNotification.value = true;
      startTimeout();
    });

    onUnmounted(() => {
      if (timer.value) {
        clearTimeout(timer.value);
      }
    });

    return {
      showNotification,
      positionClass,
      typeClasses,
      animationClasses,
      icon,
      pauseTimeout,
      resumeTimeout,
    };
  },
};
</script>
