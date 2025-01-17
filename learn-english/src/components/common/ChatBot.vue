<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="toggleChat"
      class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors"
    >
      <i :class="chatIcon" class="text-xl"></i>
    </button>

    <div
      v-if="isChatOpen"
      class="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl"
    >
      <div class="bg-primary text-white p-4 rounded-t-lg">
        <h3 class="font-bold">Chat Support</h3>
      </div>

      <div class="h-96 overflow-y-auto p-4 space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'max-w-[75%] rounded-lg p-3',
            message.isBot
              ? 'bg-gray-100 text-gray-800'
              : 'bg-primary text-white ml-auto',
          ]"
        >
          {{ message.text }}
        </div>
      </div>

      <div class="p-4 border-t">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />
          <button
            @click="sendMessage"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ChatBot',
  setup() {
    const store = useStore();
    const newMessage = ref('');

    const messages = computed(() => store.getters['chatbot/messages']);
    const isChatOpen = computed(() => store.getters['chatbot/isChatOpen']);

    const toggleChat = () => {
      store.dispatch('chatbot/toggleChat');
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      await store.dispatch('chatbot/sendMessage', newMessage.value);
      newMessage.value = '';
    };

    return {
      messages,
      isChatOpen,
      newMessage,
      toggleChat,
      sendMessage,
      chatIcon: computed(() =>
        isChatOpen.value ? 'fas fa-times' : 'fas fa-robot'
      ),
    };
  },
};
</script>
