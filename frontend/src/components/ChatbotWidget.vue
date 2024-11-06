<template>
  <div class="chat-widget">
    <button @click="toggleChat" class="chat-toggle-btn">
      <font-awesome-icon :icon="['fas', 'comment']" />
    </button>
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>{{ $t('chat.title') }}</h3>
        <button @click="toggleChat" class="close-btn">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="userInput" @keyup.enter="sendMessage" :placeholder="$t('chat.inputPlaceholder')" />
        <button @click="sendMessage" :disabled="loading">
          <font-awesome-icon :icon="['fas', 'paper-plane']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/api';
import { ChatbotResponse } from '@/types/api';

const isOpen = ref(false);
const messages = ref<{ type: 'user' | 'bot'; text: string }[]>([]);
const userInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const loading = ref(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;

  messages.value.push({ type: 'user', text: userInput.value });
  loading.value = true;

  try {
    const response = await api.post<ChatbotResponse>('/chatbot/', { input: userInput.value });
    messages.value.push({ type: 'bot', text: response.data.response_text });
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    messages.value.push({ type: 'bot', text: 'Sorry, I encountered an error. Please try again later.' });
  } finally {
    loading.value = false;
    userInput.value = '';
  }
};

onMounted(() => {
  messages.value.push({ type: 'bot', text: 'Hello! How can I help you today?' });
});

watch(messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 0);
}, { deep: true });
</script>

<style scoped>
.chatbot-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatbot-toggle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  border: none;
  cursor: pointer;
}

.chatbot-window {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chatbot-header {
  padding: 10px;
  background-color: #4f46e5;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.chatbot-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px;
  max-width: 80%;
}

.user {
  background-color: #e5e7eb;
  align-self: flex-end;
  margin-left: auto;
}

.bot {
  background-color: #4f46e5;
  color: white;
}

.chatbot-input {
  display: flex;
  padding: 10px;
}

.chatbot-input input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
}

.chatbot-input button {
  margin-left: 5px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
