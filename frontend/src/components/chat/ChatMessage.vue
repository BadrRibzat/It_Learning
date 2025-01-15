<template>
  <div :class="['message', { 'user-message': message.type === 'user' }]">
    <div class="message-content">{{ message.content }}</div>
    <div class="message-timestamp">{{ formattedTimestamp }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const formattedTimestamp = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString();
});
</script>

<style scoped>
.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f0f0f0;
}

.user-message {
  background-color: #e6f2ff;
  text-align: right;
}

.message-content {
  margin-bottom: 0.25rem;
}

.message-timestamp {
  font-size: 0.8rem;
  color: #666;
}
</style>
