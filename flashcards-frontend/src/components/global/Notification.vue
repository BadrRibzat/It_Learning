<template>
  <div 
    v-if="notification.show" 
    :class="notificationClasses"
    class="fixed top-4 right-4 z-50 p-4 rounded shadow-lg transition-all duration-300"
  >
    {{ notification.message }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const notification = computed(() => store.state.app.notification);

const notificationClasses = computed(() => {
  const baseClasses = 'text-white';
  switch (notification.value.type) {
    case 'success': return `${baseClasses} bg-green-500`;
    case 'error': return `${baseClasses} bg-red-500`;
    case 'warning': return `${baseClasses} bg-yellow-500`;
    default: return `${baseClasses} bg-blue-500`;
  }
});
</script>
