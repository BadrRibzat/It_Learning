<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
    >
      <font-awesome-icon
        :icon="isChatOpen ? ['fas', 'times'] : ['fas', 'comment']"
        class="w-6 h-6 text-white"
      />
    </button>

    <!-- Chat Window -->
    <div
      v-if="isChatOpen"
      class="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200"
    >
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">{{ $t('chat_help') }}</h3>
      </div>

      <div class="h-96 overflow-y-auto p-4" ref="chatContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="mb-4"
          :class="{
            'flex justify-end': message.type === 'user',
            'flex justify-start': message.type === 'bot'
          }"
        >
          <div
            class="max-w-3/4 rounded-lg px-4 py-2"
            :class="{
              'bg-primary text-white': message.type === 'user',
              'bg-gray-100 text-gray-900': message.type === 'bot'
            }"
          >
            {{ message.text }}
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-200">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            :placeholder="$t('type_message')"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            <font-awesome-icon icon="paper-plane" class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const isChatOpen = ref(false)
const messages = ref([
  {
    type: 'bot',
    text: 'Hello! How can I help you with your language learning journey today?'
  }
])
const newMessage = ref('')
const chatContainer = ref(null)

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  // Add user message
  messages.value.push({
    type: 'user',
    text: newMessage.value
  })

  // Simulate bot response
  setTimeout(() => {
    messages.value.push({
      type: 'bot',
      text: 'Thanks for your message! Our team will help you with your question.'
    })
  }, 1000)

  newMessage.value = ''
}

watch(messages, () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 50)
}, { deep: true })
</script>
