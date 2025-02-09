<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { logUserActivity } from '@/utils/logger';
import NotificationToast from './NotificationToast.vue';

const TIMESTAMP = '2025-02-09 14:53:58';
const USER_LOGIN = 'BadrRibzat';

interface ToastConfig {
  id?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  content: string;
  duration?: number;
  showProgress?: boolean;
  metadata?: Record<string, any>;
}

const props = withDefaults(defineProps<ToastConfig>(), {
  type: 'info',
  duration: 5000,
  showProgress: true,
  id: () => `toast-${Date.now()}`
});

const emit = defineEmits<{
  (e: 'close-toast'): void;
}>();

const notificationStore = useNotificationStore();

const logToastActivity = (action: string) => {
  logUserActivity(`toast_${action}`, {
    id: props.id,
    type: props.type,
    content: props.content,
    timestamp: TIMESTAMP,
    user: USER_LOGIN,
    metadata: props.metadata
  });
};

const closeToast = () => {
  logToastActivity('closed');
  emit('close-toast');
};

// Track toast interactions
const trackToastInteraction = () => {
  const toastElement = document.getElementById(props.id);
  if (!toastElement) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logToastActivity('viewed');
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(toastElement);

  return () => observer.disconnect();
};

onMounted(() => {
  logToastActivity('displayed');
  trackToastInteraction();

  // Report to analytics if it's an error toast
  if (props.type === 'error') {
    notificationStore.trackError({
      message: props.content,
      timestamp: TIMESTAMP,
      user: USER_LOGIN
    });
  }
});

onBeforeUnmount(() => {
  logToastActivity('unmounted');
});
</script>

<template>
  <div :id="id">
    <NotificationToast
      :type="type"
      :message="content"
      :duration="duration"
      :show-progress="showProgress"
      :timestamp="TIMESTAMP"
      @close="closeToast"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>

      <template v-if="$slots.action" #action>
        <slot name="action" />
      </template>
    </NotificationToast>
  </div>
</template>

<style scoped>
:deep(.notification-toast) {
  /* Custom toast animations */
  --toast-enter-duration: 0.3s;
  --toast-exit-duration: 0.2s;
}

@keyframes toastEnter {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastExit {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

:deep(.notification-toast-enter-active) {
  animation: toastEnter var(--toast-enter-duration) ease-out;
}

:deep(.notification-toast-exit-active) {
  animation: toastExit var(--toast-exit-duration) ease-in;
}

/* Accessibility improvements */
:deep(.notification-toast:focus) {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :deep(.notification-toast) {
    --bg-opacity: 0.95;
    background-color: rgba(26, 32, 44, var(--bg-opacity));
    color: #fff;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.notification-toast) {
    width: calc(100% - 2rem);
    margin: 0 1rem;
  }
}
</style>
