<template>
  <div class="chat-window">
    <div class="chat-messages" ref="chatMessages">
      <ChatMessage
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import ChatMessage from './ChatMessage.vue';

const store = useStore();
const chatMessages = ref(null);
const newMessage = ref('');

const messages = computed(() => store.state.chat.messages);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const userMessage = {
      content: newMessage.value,
      timestamp: new Date().toISOString(),
      type: 'user',
    };
    store.commit('chat/ADD_MESSAGE', userMessage);
    store.dispatch('chat/sendMessage', newMessage.value);
    newMessage.value = '';
  }
};

onMounted(() => {
  scrollToBottom();
});

watch(messages, () => {
  scrollToBottom();
});

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
}

.chat-input input {
  flex-grow: 1;
  margin-right: 0.5rem;
}
</style>
