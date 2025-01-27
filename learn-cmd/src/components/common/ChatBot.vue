<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Toggle Button -->
    <button
      @click="toggleChat"
      class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors"
      :aria-label="isChatOpen ? 'Close chat' : 'Open chat'"
    >
      <i :class="isChatOpen ? 'fas fa-times' : 'fas fa-robot'" class="text-xl"></i>
    </button>

    <!-- Chat Window -->
    <Transition name="slide-fade">
      <div
        v-if="isChatOpen"
        class="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <!-- Chat Header -->
        <div class="bg-primary text-white p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fas fa-robot text-xl"></i>
              <h3 class="font-bold">IT Learning Assistant</h3>
            </div>
            <button 
              @click="clearChat" 
              class="text-white hover:text-gray-200"
              title="Clear chat"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div 
          ref="messageContainer"
          class="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center text-gray-500 my-4">
            <p>Welcome! How can I help you learn IT skills today?</p>
          </div>

          <!-- Messages -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'max-w-[80%] rounded-lg p-3 flex flex-col',
              message.isUser ? 'ml-auto bg-primary text-white' : 'bg-white shadow-sm',
              message.isError ? 'bg-red-100 text-red-600' : ''
            ]"
          >
            <span>{{ message.text }}</span>
            <span 
              class="text-xs mt-1 opacity-75"
              :class="message.isUser ? 'text-white' : 'text-gray-500'"
            >
              {{ formatTime(message.timestamp) }}
            </span>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex items-center space-x-2 text-gray-500">
            <i class="fas fa-circle-notch fa-spin"></i>
            <span>Thinking...</span>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 bg-white border-t">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              :disabled="isLoading"
            />
            <button
              type="submit"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              :disabled="isLoading || !newMessage.trim()"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ChatBot',
  
  setup() {
    const store = useStore();
    const newMessage = ref('');
    const messageContainer = ref(null);

    const messages = computed(() => store.getters['chatbot/messages']);
    const isChatOpen = computed(() => store.getters['chatbot/isChatOpen']);
    const isLoading = computed(() => store.getters['chatbot/isLoading']);

    const toggleChat = () => {
      store.dispatch('chatbot/toggleChat');
    };

    const clearChat = () => {
      store.dispatch('chatbot/clearChat');
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim() || isLoading.value) return;

      await store.dispatch('chatbot/sendMessage', newMessage.value.trim());
      newMessage.value = '';
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    // Auto-scroll to bottom when new messages arrive
    watch(() => messages.value.length, async () => {
      await nextTick();
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
      }
    });

    return {
      messages,
      newMessage,
      isChatOpen,
      isLoading,
      messageContainer,
      toggleChat,
      clearChat,
      sendMessage,
      formatTime
    };
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
