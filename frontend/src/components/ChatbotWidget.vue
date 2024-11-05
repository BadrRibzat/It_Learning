<template>
  <div class="chatbot-widget">
    <button @click="toggleChat" class="chatbot-toggle-btn">
      <font-awesome-icon :icon="['fas', 'comment']" />
    </button>
    <div v-if="isOpen" class="chatbot-window">
      <div class="chatbot-header">
        <h3>{{ $t("chatbot.title") }}</h3>
        <button @click="toggleChat" class="close-btn">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <div class="chatbot-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>
      <div class="chatbot-input">
        <input v-model="userInput" @keyup.enter="sendMessage" :placeholder="$t('chatbot.inputPlaceholder')" />
        <button @click="sendMessage">
          <font-awesome-icon :icon="['fas', 'paper-plane']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import api from "@/api";

interface ChatMessage {
  type: "user" | "bot";
  text: string;
}

const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const userInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  messages.value.push({ type: "user", text: userInput.value });

  try {
    const response = await api.post("/chatbot/", { input: userInput.value });
    messages.value.push({ type: "bot", text: response.data.response_text });
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    messages.value.push({ type: "bot", text: "Sorry, I encountered an error. Please try again later." });
  }

  userInput.value = "";
};

onMounted(() => {
  messages.value.push({ type: "bot", text: "Hello! How can I help you today?" });
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
  background-color: #4F46E5;
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
  background-color: #4F46E5;
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
  background-color: #E5E7EB;
  align-self: flex-end;
  margin-left: auto;
}

.bot {
  background-color: #4F46E5;
  color: white;
}

.chatbot-input {
  display: flex;
  padding: 10px;
}

.chatbot-input input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #E5E7EB;
  border-radius: 5px;
}

.chatbot-input button {
  margin-left: 5px;
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
