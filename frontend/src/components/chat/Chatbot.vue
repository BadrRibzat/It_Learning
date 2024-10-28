<template>
  <div class="fixed bottom-4 right-4">
    <button
      @click="toggleChat"
      class="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <font-awesome-icon :icon="['fas', 'comments']" size="lg" />
    </button>
    <div
      v-if="isChatOpen"
      class="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl"
    >
      <ChatWindow />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatWindow from './ChatWindow.vue';

const isChatOpen = ref(false);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};
</script>
