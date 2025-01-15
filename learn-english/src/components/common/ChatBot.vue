<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="toggleChat"
      class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors"
    >
      <i :class="chatIcon" class="text-xl"></i>
    </button>

    <div
      v-if="isOpen"
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
import { ref, computed } from "vue";

export default {
  name: "ChatBot",
  setup() {
    const isOpen = ref(false);
    const messages = ref([
      { text: "Hello! How can I help you today?", isBot: true },
    ]);
    const newMessage = ref("");

    const toggleChat = () => {
      isOpen.value = !isOpen.value;
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      messages.value.push({
        text: newMessage.value,
        isBot: false,
      });

      const userMessage = newMessage.value;
      newMessage.value = "";

      try {
        // Simulate chatbot API response
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                response_text: "This is a simulated response.",
              },
            });
          }, 1000); // Simulate a 1-second delay
        });

        messages.value.push({
          text: response.data.response_text,
          isBot: true,
        });
      } catch (error) {
        console.error("Error:", error);
        messages.value.push({
          text: "Sorry, I encountered an error. Please try again.",
          isBot: true,
        });
      }
    };

    return {
      isOpen,
      messages,
      newMessage,
      toggleChat,
      sendMessage,
      chatIcon: computed(() => (isOpen.value ? "fas fa-times" : "fas fa-robot")),
    };
  },
};
</script>
