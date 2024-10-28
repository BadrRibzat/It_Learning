<template>
  <div class="chat-view">
    <h1>Chat</h1>
    <ChatWindow />
  </div>
</template>

<script setup>
import ChatWindow from '@/components/chat/ChatWindow.vue';
</script>

<style scoped>
.chat-view {
  height: calc(100vh - 64px); /* Adjust based on your header height */
}
</style>
