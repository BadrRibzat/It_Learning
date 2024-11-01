<template>
  <div class="fixed bottom-4 right-4 z-50">
    <div
      v-if="isOpen"
      class="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col"
    >
      <div class="p-4 bg-primary text-white flex justify-between items-center">
        <h3 class="text-lg font-semibold">Chatbot</h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <ChatWindow />
    </div>
  </div>
</template>

<script setup>
import ChatWindow from './ChatWindow.vue';

defineEmits(['close']);

const isOpen = true;
</script>
